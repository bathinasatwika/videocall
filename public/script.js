// to create a connection btwn client and server and en
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
//creating a new peer id for new user
const myPeer = new Peer(undefined, {
  host: "0.peerjs.com",
  secure: true,
  port: 443,
})

let mystream;

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  mystream=stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream,call.peer)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId,stream)
  });

})

//when a new peerid is created this event is triggered
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})
myPeer.on("error", (err) => {
  console.error(" PeerJS Error:", err);
});



//connecting to new user by sharing stream and new user adds this stream to their grid and respond with their stream its added in this girid
function connectToNewUser(userId, stream) {

  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userId);
  });

  peers[userId] = call
}

//adding videostream to the user grid
function addVideoStream(video,stream,peerid) {
  video.srcObject = stream
  video.id=peerid;
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

//mictoggle
let ismicon=true;
function micfunc(){

  ismicon=!ismicon
  mystream.getAudioTracks().forEach(track => {
    track.enabled = ismicon;
  });
  let micBtn = document.getElementById("mictoggle");
 micBtn.innerText= ismicon? "Mute":"Unmute";
}

//videotoggle
let isvideoon=true;
function videofunc(){

  isvideoon=!isvideoon
  mystream.getVideoTracks().forEach(track => {
    track.enabled = isvideoon;
  });
  let videoBtn = document.getElementById("videotoggle");
  videoBtn.innerText= isvideoon?"Video off":"Video on";
}


//when a user ends the call

document.getElementById("disconnecting").addEventListener("click",function (){
  
  socket.emit('disconnect-user',myPeer.id);
  setTimeout(() => {
    window.location.href = "/end";
}, 500); 
  
});

 //removes left userid stream in grid
 socket.on('user-disconnected', userId => {
  
   const videoElement = document.getElementById(userId);
   if (videoElement) {
    videoElement.parentNode.removeChild(videoElement); // Remove parent div
}
 });


 