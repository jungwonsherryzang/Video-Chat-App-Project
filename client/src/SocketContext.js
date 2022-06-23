import React, { createContext, useState, useRef, useEffect } from 'react';
//useRef for video content
import { io } from 'socket.io-client';
import Peer from 'simple-peer';


//initial context
const SocketContext = createContext();

//initial instance of socket.io
const socket = io("http://localhost:3000");

//react functional components
const ContextProvider = ({ children }) => {

    //setting states for video chat
    const [stream, setStream] = useState();

    //states for useEffect()
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});

    //states for answerCall()
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    //states for callUser()
    const [name, setName] = useState('');

    //Refs
    //populate that video iframe with the src of stream 
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    //what we want to do when page loads
    useEffect(() => {
        //get permission to use video and audio
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }) //in the website, microphone and camera allow
            //getUserMedia: from WebRTC API


            .then((currentStream) => { //getting stream
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
            });

            socket.on("me", (id) => setMe(id));


            //need to be the same name as I defined in index.js file-> 'calluser'
            socket.on('calluser', ({ from, name: callerName, signal }) => { //need to get a data object
                setCall({ isReceivedCall: true, from, name: callerName, signal });
            });
    }, []); //need to put [] here->otherwise, it is always going to run
    

    //those three are all actions that we need for video chat
    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });


        //callback function once we receive the signal(not the connection)
        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from }); //need to pass data to answer call
        });


        //want to set another ref
        peer.on('stream', (currentStream) => {

            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);


        connectionRef.current = peer; 
    }

    const callUser = (id) => { 
        const peer = new Peer({ initiator: true, trickle: false, stream });


        //once we receive the signal,
        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true); //true: because we accpeted

            peer.signal(signal);
        });

        connectionRef.current = peer; //connectionRef is not equal to peer
    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }


    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {children}
        </SocketContext.Provider>
    );
};
export { ContextProvider, SocketContext };

