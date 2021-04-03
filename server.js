const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use('/', express.static('dist'));

app.get('*', (req,res,next) => {
    const indexFile = path.resolve(__dirname + '/dist/index.html');
    res.sendFile(indexFile);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('sync-game', (data) => {
    io.emit('sync-game', data);
  })
});

http.listen(1337, () => {
  console.log('listening on *:1337');
});