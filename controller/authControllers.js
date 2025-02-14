import User from '../model/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

// register
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure nodemailer (Use Gmail, Mailtrap, or SendGrid)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register function with email verification
export const register = async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use. Please log in." });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Generate verification token
        const verificationToken = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Create new user (not verified yet)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
            role: req.body.role,
            user_role: req.body.user_role,
            description: req.body.description,
            isVerified: false,
            verificationToken
        });

        // Save user to DB before sending email
        await newUser.save();

        // Send verification email
        const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: "Verify Your Email - Farm Swift",
            html: `<h2>Welcome to Farm Swift!</h2>
                   <p>Click the link below to verify your email:</p>
                   <a href="${verificationLink}">Verify Email</a>
                   <p>This link expires in 24 hours.</p>`
        });

        res.status(200).json({ success: true, message: "Registration successful! Check your email to verify your account." });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ success: false, message: "Failed to register. Try again later." });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid verification link." });
        }

        // Update user to verified
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully. You can now log in." });

    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid or expired token." });
    }
};

// link to resend verification incase it expires
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User is already verified." });
        }

        // Generate new verification token
        const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Save new token
        user.verificationToken = verificationToken;
        await user.save();

        // Send new verification email
        const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Email - Farm Swift",
            html: `<h2>Welcome to Farm Swift!</h2>
                   <p>Click the link below to verify your email:</p>
                   <a href="${verificationLink}">Verify Email</a>
                   <p>This link expires in 24 hours.</p>`
        });

        res.status(200).json({ success: true, message: "A new verification link has been sent to your email." });

    } catch (err) {
        console.error("Error sending verification email:", err);
        res.status(500).json({ success: false, message: "Failed to resend verification email." });
    }
};


// login
export const login = async(req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email });

        // If user not found
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: "Email not verified. Please check your email." });
        }

        // Check password
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }

        const { password, role, ...rest } = user._doc;

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });

        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }).status(200).json({ success: true, message: "Successfully logged in", token, data: { ...rest }, role });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to login" });
    }
};