import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

/**
 * Cache the mongoose connection on the global object so that Next.js hot
 * reloads in development do not open a new connection on every request.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => {
      console.log("Connected to the database");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
