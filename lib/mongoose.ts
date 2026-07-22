import mongoose from "mongoose";
import { seedDBIfEmpty } from "./seed";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export default async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((m) => {
                console.log("[MongoDB] Connected successfully");
                return m;
            })
            .catch((err) => {
                cached.promise = null;
                console.error("[MongoDB] Connection error:", err);
                throw err;
            });
    }

    cached.conn = await cached.promise;

    // Seed database in background if empty
    seedDBIfEmpty().catch((err) => console.error("[Seeding] Error:", err));

    return cached.conn;
}