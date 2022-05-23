const express = require("express");
const morgan = require("morgan");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);

//Peer
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// morgan middleware
app.use(morgan("dev"));

// setting ejs view engine
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use("/peerjs" , peerServer);

// Room 
app.get("/", (req, res) => {
    res.redirect("/${uuidv4()}");
});

app.get("/:room" , (req,res) =>{
    res.render("home" , { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);
    });
});

// Listening local server
server.listen(3000 , () =>{
    console.log("server is started on 3000 port");
});