var socket = io("/");
const videoG = document.getElementById("video-grid"); 
const myVideo = document.createElement("video");
myVideo.muted = true;  // Off The videos micrphone

var peer = new Peer(undefined , {
    path: "/peerjs",
    host: "/",
    port: "3000",
});


let myVideoStream;
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;


navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo , stream);

        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
      
            call.on("stream", (userVideoStream) => {
              addVideoStream(video, userVideoStream);
            });
        });
      
        socket.on("user-connected", (userId) => {
            console.log("User connected" + userId);
            connectToNewUser(userId, stream);
        });
    });

peer.on("call", function (call) {
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        const video = document.createElement("video");
        call.on("stream", function (remoteStream) {
          addVideoStream(video, remoteStream);
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
});
  
peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, streams) => {
    var call = peer.call(userId, streams);
    console.log(call);
    var video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      console.log(userVideoStream);
      addVideoStream(video, userVideoStream);
    });
};

// Adding videos in stream 
const addVideoStream = (video , stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata" , () => {
        video.play();
    });
    videoG.append(video);
};


// Invit Function 
function Invite() {
  prompt(
    "Copy This Link for inviting your friends",
    window.location.href
  );
};

function video() {
  // myVideoStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  let track = myVideoStream.getVideoTracks()[0].enabled;
  if(track){
    myVideoStream.getVideoTracks()[0].enabled = false;
    const html = '<i class="fa fa-video-slash"></i>'
    document.getElementById("video").innerHTML = html;
  }
  else{
    myVideoStream.getVideoTracks()[0].enabled = true;
    const html = '<i class = "fa fa-video-camera"></i>'
    document.getElementById("video").innerHTML = html;
  }
}

function micrphone(){
  // myAudioStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  let track = myAudioStream.getAudioTracks()[0].enabled;
  if(track){
    myAudioStream.getAudioTracks()[0].enabled = false;
    const html = '<i class="fa fa-pause-circle"></i>';
    document.getElementById("mike").innerHTML = html;
  }
  else{
    myAudioStream.getAudioTracks()[0].enabled = true;
    const html = '<i class = "fa fa-microphone"></i>';
    document.getElementById("mike").innerHTML = html;
  }
}