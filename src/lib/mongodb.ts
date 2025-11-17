import mongoose from 'mongoose';

let cachedClient: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env or pass it at runtime');
  }

  try {
    const client = await mongoose.connect(MONGODB_URI!);
    cachedClient = client;
    console.log('Connected to MongoDB');
    return client;
  } catch (e) {
    console.error('Failed to connect to MongoDB', e);
    throw e;
  }
}
