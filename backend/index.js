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


server.listen(PORT, () => {
  console.log("server connected!");
});
