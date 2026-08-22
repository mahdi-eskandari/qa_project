import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI

export default async function connectdb() {
    try {
        if (mongoose.connection.readyState === 1) return; // اگر قبلاً وصل شده بود، دوباره وصل نشه
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
    }
}