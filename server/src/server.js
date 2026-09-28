import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/monsz'
    );

    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB connection failed:', e.message);
  }

  app.listen(port, () => {
    console.log(`MONSZ API running on ${port}`);
  });
};

startServer();
