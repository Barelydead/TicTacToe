const io = require('socket.io')();

let numberOfPlayers = 0;

io.on('connection', socket => {
  console.log(`connect: ${socket.id}`);

  socket.on('sync-game', (data) => {
    io.emit('sync-game', data);
  })

  socket.on('new-player', (data) => {
    numberOfPlayers++;
    socket.emit('new-player', {
      id: numberOfPlayers,
      marker: numberOfPlayers % 2 == 0 ? 'X' : 'O',
    })
  })

  socket.on('disconnect', () => {
    console.log(`disconnect: ${socket.id}`);
  });
});

io.listen(1337, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});