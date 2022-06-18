//Defining socket logic in one file
import React, { createContext, useState, useRef, useEffect } from 'react';
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

    //populate that video iframe with the src of stream 
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    
    useEffect(() => {
        //get permission to use video and audio
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
            });

            socket.on("me", (id) => setMe(id)); 


            socket.on('calluser', ({ from, name: callerName, signal }) => { //need to get a data object
                setCall({ isReceivedCall: true, from, name: callerName, signal });
            });
    }, []); //to prevent always running
    

    //for video chat
    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from });
        });


        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    
    const callUser = (id) => { 
        const peer = new Peer({ initiator: true, trickle: false, stream });
        //setting initiator as a true cause we are the person who is calling

        //once we receive the signal,
        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
            //With id, we know who is calling to me
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        //user can decline or accpet the call-> on the backend, we can callAccepted
        socket.on('callaccepted', (signal) => {
            setCallAccepted(true); //true: because we accpeted

            peer.signal(signal);
        });

        connectionRef.current = peer; 
    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        //reloading the page and providing new userid to new user
        window.location.reload();
    }


    //to call all component called SocketContext.Provider
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

