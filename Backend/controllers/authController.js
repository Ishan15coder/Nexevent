const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const { sendOTPEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);

        await OTP.deleteMany({ email, action: 'account_verification' });
        await OTP.create({
            email,
            name,
            password: hashedPassword,
            otp,
            action: 'account_verification'
        });

        await sendOTPEmail(email, otp, 'account_verification');

        res.status(201).json({
            message: 'OTP sent successfully. Please check your email for the OTP to verify your account.',
            email
        });

    } catch (error) {
        console.error('Registration/OTP error:', error.message);
        res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials. Please Sign Up first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified && user.role === 'user') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ email, action: 'account_verification' });
        await OTP.create({
            email,
            name: user.name,
            password: user.password,
            otp,
            action: 'account_verification'
        });
        sendOTPEmail(email, otp, 'account_verification').catch(err => {
            console.error('Background OTP email error:', err.message);
        });

        return res.status(400).json({
            error: 'Account not verified. Please check your email for the OTP to verify your account.',
        });
    }

    res.json({
        message: 'Login successful',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });
}

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
        email,
        otp,
        action: 'account_verification'
    });

    if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name: otpRecord.name || 'User',
            email: otpRecord.email,
            password: otpRecord.password,
            role: 'user',
            isVerified: true
        });
    } else {
        user.isVerified = true;
        await user.save();
    }

    await OTP.deleteMany({ email, action: 'account_verification' });

    res.json({
        message: 'Account verified and created successfully. You can now log in.',
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });
}

exports.resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ error: 'Account is already verified' });
        }

        const existingOtp = await OTP.findOne({ email, action: 'account_verification' });
        if (!existingOtp && !existingUser) {
            return res.status(404).json({ error: 'No pending registration found. Please register first.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Resent OTP for ${email}: ${otp}`);

        const name = existingOtp ? existingOtp.name : (existingUser ? existingUser.name : '');
        const password = existingOtp ? existingOtp.password : (existingUser ? existingUser.password : '');

        await OTP.deleteMany({ email, action: 'account_verification' });
        await OTP.create({
            email,
            name,
            password,
            otp,
            action: 'account_verification'
        });

        sendOTPEmail(email, otp, 'account_verification').catch(err => {
            console.error('Background OTP email error:', err.message);
        });

        res.json({ message: 'A new OTP has been sent to your email. Please check your inbox and spam folder.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resend OTP: ' + error.message });
    }
}