import express from 'express';
import { login, signup, verifyOtp, getProfile, resendOtp, testEmail } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const rout = express.Router();

// Test endpoint
rout.get('/test', (req, res) => {
    res.json({ message: 'Auth API is working!', timestamp: new Date().toISOString() });
});

rout.post('/signup', signup);
rout.post('/verify-otp', verifyOtp);
rout.post('/resend-otp', resendOtp);
rout.post('/login', login);
rout.get('/test-email', testEmail);
rout.get('/profile', authenticateToken, getProfile);

export default rout;