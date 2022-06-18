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

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send('Server is running'); //when user visits server, will get this message
})
//----------------------------------server setup-------------------------------------

//----------------------------------socket setup-------------------------------------
io.on('connection', (socket) => {
    socket.emit('me', socket.id); //emit the id as soon as the socket opens
    console.log(socket.id); //TRY
    
    
    //socket handlers
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });
    
    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit(
            "calluser", { signal: signalData, from, name });
        })
        
        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callaccepted", data.signal);
    })
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
