import mongoose from "mongoose";
import { DB_Name } from "../constant.js";

// Debug listeners — these will show up in Render logs
mongoose.connection.on("connected", () => {
    console.log("✅ Mongoose connected to DB cluster");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Mongoose disconnected from DB");
});

const connectDB = async () => {
    const uri = `${process.env.MONGODB_URL}/${DB_Name}`;

    // Log a sanitized URI (hide password) for debugging
    console.log("🔌 Connecting to MongoDB:", uri.replace(/:([^@]+)@/, ":****@"));

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Fail fast instead of 10s buffer
        });
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        // Exit so Render restarts the service and retries
        process.exit(1);
    }
};

export default connectDB;