const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const { generateMessage } = require('./src/utils/messages');
const { generateLocationMessage } = require('./src/utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;


const publicDirectoryPath = path.join(__dirname, '/public');
console.log(publicDirectoryPath);
app.use(express.static(publicDirectoryPath));

// app.get('/', function(req, res) {
//     res.sendFile(__dirname+'/public/index.html')
// });
var count = 0;

io.on('connection', (socket) => {
    console.log('a user is connected.');
    socket.on('newMessage', (message, callback) => {
        
        io.emit('message', generateMessage(message));
        callback();
    })

    socket.on('sendLocation', (position) => {
        io.emit('location', generateLocationMessage(position));
    });

    socket.on('join', ({username, room}) => {
        socket.join(room);
        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the conversation in Room.`));
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the conversation.');
    })


    // socket.emit('updateCount', count); //second argument is first argument of callback in client.

    // socket.on('increment', () => {
    //     count++;
    //     io.emit('updateCount', count);
    // })
})

server.listen(port, function () {
    console.log('Server is running at port ' + port);
})

