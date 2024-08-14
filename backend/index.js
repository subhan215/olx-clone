require("dotenv").config();
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const path = require("path");
const { connectMongoDb } = require("./src/db");
const userRoute = require("./src/routes/user.routes");
const postRoute = require("./src/routes/post.routes");
const chatRoute = require("./src/routes/chat.routes")
const socketIo = require('socket.io');
const transactionRoute = require("./src/routes/transaction.routes");

connectMongoDb(`${process.env.MONGODB_URI}khareedoFarokht`);
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser()); 
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.static(path.resolve("./public"))); 


//api url ki starting yahan aur jo endpoint hit karna wo routes main
//import route
//declaration
app.use("/api/v1/users",userRoute)
app.use("/api/v1/posts",postRoute)
app.use("/api/v1/chat",chatRoute)
app.use("/api/v1/transaction",transactionRoute)
const io = socketIo(server , {cors: {
  origin: 'http://localhost:3000'
} })
io.on('connection' , (socket) => {
  socket.on("register" , ()=> {
    console.log("New Client Connected")
  })
  
  socket.on('message' , (data)=> {
    console.log(data)
    io.emit('message' , data)
  })
  socket.on('disconect' , ()=> {
    console.log("client disconnected")
  })
  
})

server.listen(PORT, () => {
  console.log("server connected!");
});
