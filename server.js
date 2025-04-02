//importing express library to handle http requests, socket connctions, signaling the servers
const express = require('express');
// to create an instance of express
const app = express();

const { v4: uuidV4 } = require('uuid')

//creating a connection btwn user and server until they disconnect from server
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

//to access input values in the form it is used
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse form data

//to render html pages and also allows dynamic variable like ROOM-ID where as html is static
app.set('view engine', 'ejs')
//as we r using script.js in frontend i have to serve it in server side and later can use it in frontend
// and also serve the files in public folder
app.use(express.static('public'))

app.get('/newurl',(req,res)=>{
    res.redirect(`${uuidV4()}`)
});

app.post('/joinurl',(req,res)=>{
  const roomurl=req.body.roomurl;
  res.redirect(roomurl);
});

app.get('/signup',(req,res)=>{
  res.render('signup');
});

app.get('/signedin',(req,res)=>{
  res.render('rooms');
});

app.get('/end',(req,res)=>{
  res.render('end');
})
app.get('/', (req, res) => {
  res.render('signup');
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

//event is triggered when we connect client and server using sockets
io.on('connection', socket => {
  
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    //emits every other user except sender if i use socket.to()
    //emits everyone in the room id even sender if i use io.to()
    //broadcast.emit means sends everyone in other rooms as well except sender
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect-user', () => {
       socket.to(roomId).emit('user-disconnected', userId)
    })
    socket.on('disconnect', () => {
      console.log(userId);
      socket.to(roomId).emit('user-disconnected', userId);
   }) 
  })
} );


//http requests are listening on port 4000
server.listen(4000);

             











//when there is a form with get or post method we need button type submit inside form to trigger the method in server side


