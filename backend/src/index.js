import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

dotenv.config({
  path: './.env',
});

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FORNT_END_URL, // frontend's URL
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FORNT_END_URL // frontend's URL
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

// socket.io configuration fro web socket connection

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

