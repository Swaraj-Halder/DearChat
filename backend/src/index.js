// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http"

// dotenv.config({
//   path: "./.env",
// });

// const app = express();

// const server = http.createServer(app);

// app.use(express.json());

// app.use(
//   cors({
//     origin: '*',
//   })
// );

// const connectDb = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URI}/dearchat`
//     );
//     console.log(
//       `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     console.log("MongoDB connection  Error:", error);
//     process.exit(1);
//   }
// };
// connectDb()
//   .then(() => {
//     server.listen(process.env.PORT || 8000, () => {
//       console.log(`SERVER is running at PORT ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("MongoDB connection failed !!", err);
//   });

// import { userRouter, socketRouter } from "./routes/user.routes.js";

// app.use("/api/v1/user", userRouter);


// // app.use("/socket.io",socketRouter)
// import {Server} from "socket.io"

//   const io = new Server(server,{
//     cors: {
//       origin: 'http://localhost:5173', // Your frontend's URL
//       methods: ['GET', 'POST'],
//     },
//   });
//   io.on("connection", (socket) => {
//     console.log('A user connected:', socket.id);
//     socket.on("message", (message) => {
//       console.log(message);
      
//         io.emit("message", message)
//   })
// })


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import path from 'path';

dotenv.config({
  path: './.env',
});

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173'  // Your frontend's URL
  })
);

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/dearchat`
    );
    console.log(
      `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log('MongoDB connection Error:', error);
    process.exit(1);
  }
};

connectDb()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`SERVER is running at PORT ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed !!', err);
  });

import { userRouter } from './routes/user.routes.js';

app.use('/api/v1/user', userRouter);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html")
})

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

