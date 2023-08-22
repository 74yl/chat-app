const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

const users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('userJoined', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('userList', users);
  });

  socket.on('message', (data) => {
    if (socket.username) {
      // Convert emoji shortcodes to actual emojis
      const emojiMessage = data.replace(/:\)/g, '😄');

      io.emit('message', `${socket.username}: ${emojiMessage}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (socket.username) {
      users.splice(users.indexOf(socket.username), 1);
      io.emit('userList', users);
    }
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});
