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
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        // Allow all Vercel deployments and localhost
        if (origin.includes('.vercel.app') || 
            origin.includes('localhost') ||
            origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
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