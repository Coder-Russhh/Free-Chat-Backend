const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io");

const app = express();
dotenv.config();

// middlewares---
app.use(cors()); //cross-origin
app.use(express.json()); //convert into json

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)


// mongoose connection---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

// server were listening to env port
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);


// server side socket implementation---
const io = socket(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

// global.onlineUsers = new Map();

// io.on("connection",(socket)=>{
//   global.chatSocket = socket;
//   socket.on("add-user", (userId)=>{
//     onlineUsers.set(userId, socket.id);
//   })
// })
