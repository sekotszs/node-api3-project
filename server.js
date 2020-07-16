const express = require("express");
const helmet = require("helmet");
const userRouter = require("./users/userRouter");
// const morgan = require("morgan");
const server = express();
const cors= require("cors");



server.use(express.json());
server.use("/api/users", userRouter);
server.use(helmet());
// server.use(morgan("dev"));
server.use(logger)
server.use(cors());

server.get("/", (req, res) => {
  res.send(`Node-Api3-Project: Zoe Stokes`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} request`)
  console.log(req.url);
  console.log(Date.now())
 
  next();
}

module.exports = server;
