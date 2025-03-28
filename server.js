const express = require('express');
const { rmSync } = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/end',(req,res)=>{
  res.render('end');
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    //emits every other user except sender if i use socket.to()
    //emits everyone in the room id even sender if i use io.to()
    //broadcast.emit means sends everyone in other rooms as well except sender
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect-user', (userId) => {
       socket.to(roomId).emit('user-disconnected', userId)
    })
    socket.on('disconnect', (userId) => {
      socket.to(roomId).emit('user-disconnected', userId)

   })
  })
})

server.listen(4000);