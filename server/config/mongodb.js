import mongoose from "mongoose";

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri) {
            console.error('MONGODB_URI is not set in environment. Set MONGODB_URI to your connection string (include the database name, e.g. /imagify)');
            process.exit(1);
        }

        // Normalize accidental duplicate database segment, e.g. replace '/imagify/imagify' with '/imagify'
        try {
            // Only modify the path portion; keep query params intact
            const parts = uri.split('?');
            const base = parts[0];
            const query = parts[1] ? `?${parts[1]}` : '';

            // Collapse duplicated trailing segment like '/db/db' -> '/db'
            const normalizedBase = base.replace(/\/([^\/]+)\/\1$/, '/$1');

            if (normalizedBase !== base) {
                console.warn('Detected duplicated DB segment in MONGODB_URI; normalizing connection string.');
                uri = normalizedBase + query;
            }
        } catch (e) {
            // If normalization fails, fall back to original uri
            console.warn('Failed to normalize MONGODB_URI, proceeding with given value.');
        }

        mongoose.connection.on('connected', () => {
            console.log("MongoDB Connected Successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB Connection Error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB Disconnected");
        });

        // Use the provided URI directly. The URI should include the database name (for example: mongodb+srv://user:pass@host/imagify)
        await mongoose.connect(uri);

        console.log("MongoDB Connection Attempted");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;