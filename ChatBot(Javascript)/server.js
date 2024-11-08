const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exp = require('constants');
const PORT = 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// middle-wares

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// socket -connection

io.on('connection', (socket) => {
    console.log("User is connected :${socket.id}");

    // to listen chat msg from clients
    socket.on('chatMsg', (msg) => {
        // broadcasting msg to all clients
        io.emit('chatMsg', msg);

        // automated response
        if (msg.toLowerCase().includes('hello') || msg.toLowerCase().includes('hi')) {
            setTimeout(() => {
                io.emit('chatMsg', 'Bot: Hi there! How can I help you?');
            }, 1000);
        }
        if (msg.toLowerCase().includes('can you tell me a joke?')) {
            setTimeout(() => {
                io.emit('chatMsg', 'Bot: What did the policeman say to his hungry stomach? Freeze. You are under the vest');
            }, 1000);
        }
    });
     //for disonnecting the client
socket.on('disconnect', () => {
    console.log('User disconnected');
});

   
});



    

// to start the server
server.listen(PORT, function () {
    console.log('server started on Port:' + PORT);
});
