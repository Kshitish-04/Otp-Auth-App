import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
//done

// Test email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error.message);
        console.log('Check your Gmail app password and 2FA settings');
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

//Register
export const signup = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const existing = await User.findOne({email});

        if(existing){
            return res.status(400).json({message: "Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({name, email, password: hashedPassword, otp});
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Account Verification - Auth App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Hello ${name},</p>
                    <p>Thank you for signing up! Please use the following OTP to verify your email:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #667eea; font-size: 2em; margin: 0;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't create this account, please ignore this email.</p>
                </div>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ OTP sent successfully to ${email}: ${otp}`);
            console.log('Message ID:', info.messageId);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            console.log(`🔑 MANUAL OTP for ${email}: ${otp}`);
            console.log('Check your email configuration or use the OTP above');
        }

        res.json({message: "User registered successfully. Please check your email for OTP."});

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({message: error.message || "Registration failed"});
    }
};



export const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(user.otp !== otp){
            return res.status(400).json({message: "Invalid OTP"});
        }

        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.json({message: "Email verified successfully"});
    }catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(!user.isVerified){
            return res.status(400).json({message: "Please verify your email"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({message: "Login successful", token});

    }catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Resend OTP - Auth App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">OTP Resent</h2>
                    <p>Hello ${user.name},</p>
                    <p>Here's your new OTP:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #667eea; font-size: 2em; margin: 0;">${otp}</h1>
                    </div>
                </div>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ OTP resent successfully to ${email}: ${otp}`);
            console.log('Message ID:', info.messageId);
        } catch (emailError) {
            console.error('❌ Email resend failed:', emailError);
            console.log(`🔑 MANUAL OTP for ${email}: ${otp}`);
        }

        res.json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: error.message || "Failed to resend OTP" });
    }
};

export const testEmail = async (req, res) => {
    try {
        const testMail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email - Auth App',
            text: 'This is a test email to verify SMTP configuration.'
        };
        
        const info = await transporter.sendMail(testMail);
        console.log('Test email sent:', info.messageId);
        res.json({ message: 'Test email sent successfully', messageId: info.messageId });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({ message: 'Test email failed', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};