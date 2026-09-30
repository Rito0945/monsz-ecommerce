import mongoose from 'mongoose';
import app from '../src/app.js';

let isConnected = false;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not configured');
  }

  // Reuse an existing connection when the Vercel function is warm.
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error('API initialization failed:', error);

    return res.status(500).json({
      ok: false,
      brand: 'MONSZ',
      message: 'MONSZ API initialization failed',
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error.message
    });
  }
}
