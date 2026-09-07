const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    lookup: (hostname, options, callback) => {
        return dns.lookup(hostname, { family: 4 }, callback);
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 8000
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const title = `Booking Confirmed: ${eventTitle}`;
        const html = `
            <h2>Hi ${userName}!</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
            <p>Thank you for choosing Nexevent.</p>
        `;

        if (process.env.RESEND_API_KEY) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'NexEvent <onboarding@resend.dev>',
                    to: userEmail,
                    subject: title,
                    html
                })
            });
            if (res.ok) {
                console.log('Booking email sent via Resend API to', userEmail);
                return;
            }
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html
        };
        await transporter.sendMail(mailOptions);
        console.log('Booking email sent successfully via SMTP to', userEmail);
    } catch (error) {
        console.error('Error sending booking email:', error.message);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Nexevent Account' : 'Nexevent Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Nexevent account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #111;">${title}</h2>
                <p style="color: #555; font-size: 16px;">${msg}</p>
                <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;

        // Try Resend HTTPS API first if API key is provided (HTTPS port 443 never blocked by firewalls)
        if (process.env.RESEND_API_KEY) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'NexEvent <onboarding@resend.dev>',
                    to: userEmail,
                    subject: title,
                    html
                })
            });
            if (res.ok) {
                console.log(`OTP sent via Resend API to ${userEmail} for ${type}`);
                return;
            }
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent via SMTP to ${userEmail} for ${type}`);
    } catch (error) {
        console.error(`[EMAIL DELIVERY NOTICE] OTP for ${userEmail}: ${otp} (SMTP Note: ${error.message})`);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };