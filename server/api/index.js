import mongoose from 'mongoose';
import app from '../src/app.js';

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
