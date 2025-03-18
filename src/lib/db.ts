import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Validate MongoDB URI format
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: CachedConnection = {
  conn: null,
  promise: null,
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function connectWithRetry(retries = MAX_RETRIES): Promise<typeof mongoose> {
  try {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4
    };

    console.log('Attempting MongoDB connection...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));

    const connection = await mongoose.connect(MONGODB_URI, opts);
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }
    throw error;
  }
}

export default async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    cached.promise = connectWithRetry()
      .catch((error) => {
        console.error('Failed to establish MongoDB connection after retries:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to establish MongoDB connection:', error);
    throw error;
  }
} 