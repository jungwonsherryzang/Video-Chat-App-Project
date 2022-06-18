//BACKEND SIDE
//import app from 'express';
//import cors from 'cors'; 
const app = require("express")();
const server = require("http").createServer(app); //http: built-in node module
const cors = require("cors"); //for cross-origin request->useful when we deploy application

//initialize empty reactapp

//setting io server side instance
const io = require("socket.io")(server, {
    cors: {
        origin: "*", //allow access from all origins
        methods: ["GET", "POST"]
    }
});

//express.js
//to mount the specified middleware functions at the path->(path, callback)
app.use(cors());

const PORT = process.env.PORT || 3000;

//creating first route
//"/":root route
//router: keeps your UI in sync with the URL
app.get("/", (req, res) => {
    res.send('Server is running'); //when user visits server, will get this message
})
//----------------------------------server setup-------------------------------------

//----------------------------------socket setup-------------------------------------
//socket is using for real-time data transmission
io.on('connection', (socket) => {
    socket.emit('me', socket.id); //emit the id as soon as the socket opens
    //will give certain id on the frontend side
    console.log(socket.id); //TRY
    
    
    //socket handlers
    socket.on('disconnet', () => {
        socket.broadcast.emit("callended"); //broadcast a message
    });
    
    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        //.to().emit: emitting to 'whom'
        io.to(userToCall).emit(
            "calluser", { signal: signalData, from, name });
        })
        
        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callaccepted", data.signal);
    })
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));