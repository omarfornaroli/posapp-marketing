import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let cachedClient: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await mongoose.connect(MONGO_URI!);
    cachedClient = client;
    console.log('Connected to MongoDB');
    return client;
  } catch (e) {
    console.error('Failed to connect to MongoDB', e);
    throw e;
  }
}
