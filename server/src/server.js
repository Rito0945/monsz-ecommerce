import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 5000;

mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/monsz'
  )
  .then(() => {
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`MONSZ API running on ${port}`);
    });
  })
  .catch((e) => {
    console.error(
      'MongoDB connection failed:',
      e.message
    );

    app.listen(port, () => {
      console.log(
        `MONSZ API running on ${port} — database unavailable`
      );
    });
  });
