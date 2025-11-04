// import 'dotenv/config';
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URL) {
    console.error('❌ MONGO_URL environment variable is not set');
}
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is not set');
}

console.log('Environment check:', {
    MONGO_URL: process.env.MONGO_URL ? 'Set' : 'Missing',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing'
});

//connect
connectDB();

const app = express();
app.use(express.json())
// app.use(cors())
app.use(cors({
    origin: [
        'https://production-otp-auth-app-frontend.vercel.app',  // Frontend Vercel URL
        'http://localhost:5173',              // For local development
        'http://localhost:3000'               // Alternative local port
    ],
    credentials: true
}));
app.get("/", (req, res) => {
    res.send("API is running..");
});
 
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
// Updated to listen on 0.0.0.0 for Render compatibility
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)     
});