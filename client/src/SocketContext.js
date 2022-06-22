//Defining socket logic in one file
//going to be inside of the react context
import React, { createContext, useState, useRef, useEffect } from 'react';
//useRef for video content
import { io } from 'socket.io-client';
import Peer from 'simple-peer';


//initial context
const SocketContext = createContext();

//initial instance of socket.io
const socket = io("http://localhost:3000"); //once we deploy our application, able to pass the full URL of the deploy server

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

            //returns promise so, use .then() 
            .then((currentStream) => { //getting stream
                setStream(currentStream);

                myVideo.current.srcObject = currentStream; //current is the real DOM element and perform srcObject function() in DOM
            });
            //------until this------
            //not only setting the current stream to the state
            //but also setting it to ref which is going to populate our video iframe once we include it in code
            //when it comes to requesting permissions from the user, 

            //listen for specific action
            //in backend, created socket.emit('me')->will emit our id as soon as the connection opens
            //in frontend(here), getting that specific id
            socket.on("me", (id) => setMe(id));  //setting to our state and pass in the id


            //need to be the same name as I defined in index.js file-> 'calluser'
            socket.on('calluser', ({ from, name: callerName, signal }) => { //need to get a data object
                setCall({ isReceivedCall: true, from, name: callerName, signal });
            });
    }, []); //need to put [] here->otherwise, it is always going to run
    

    //those three are all actions that we need for video chat
    const answerCall = () => {
        setCallAccepted(true);

        //similar to the socket->having actions and handlers gonna happen once we call somebody or answer a call
        const peer = new Peer({ initiator: false, trickle: false, stream });
        //setting initiator as a false cause we are not initiating, just answering
        //setting trickle as true, multiple signal event may be emitted fro the peer object
        //set stream to state as well


        //callback function once we receive the signal(not the connection)
        peer.on('signal', (data) => {
            //using socket here, to intertwine with peers to finally establish that video connection
            socket.emit('answerCall', { signal: data, to: call.from }); //need to pass data to answer call
        });


        //want to set another ref
        peer.on('stream', (currentStream) => {
            //want to set other uservideo
            //stream for other user 
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);
        //call is from socket.on('calluser') above

        connectionRef.current = peer; //means that our current connection is equal to the current peer who is inside of this connection
    }

    const callUser = (id) => { //going to pass id as parameter of this function 
        const peer = new Peer({ initiator: true, trickle: false, stream });
        //setting initiator as a true cause we are the person who is calling

        //once we receive the signal,
        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
            //With id, we know who is calling to me
        });

        peer.on('stream', (currentStream) => {
            //want to set other uservideo
            userVideo.current.srcObject = currentStream;
        });

        //user can decline or accpet the call-> on the backend, we can callAccepteds
        socket.on('callaccepted', (signal) => {
            setCallAccepted(true); //true: because we accpeted

            peer.signal(signal);
        });

        connectionRef.current = peer; //connectionRef is not equal to peer
    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy(); //destroy specific connection
        //destroy(): stp receiving input from the user's camera and the audio

        //reloading the page and providing new userid to new user in socket.on('me', (id) => setMe(id)) above
        window.location.reload();
        //why using this:couldnt get it to work to call another user immediately after hanging up the call with the first user
    }


    //context works in a way that having socketcontext above, 
    //and having something known as a provider
    //component called SocketContext.Provider
    return (
        <SocketContext.Provider value={{
            //for the value, we want to access all components from states including functions
            //everything passing in here, is going to be globally accessible through all components
            //including all states, functions-> so that we can use it in all components
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
            {children} {/* all the components that having in there, are going to be inside of that socket wrapped into it */}
        </SocketContext.Provider>
    );
};
export { ContextProvider, SocketContext };

