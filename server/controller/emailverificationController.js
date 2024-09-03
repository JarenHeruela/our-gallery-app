// controllers/authController.js
const UserModel = require('../models/userModels');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.register = async (req, res) => {
    const {username,email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await User.create(username, email, password);
    if (error) {
      return res.status(500).json({ message: 'User registration failed', error });
    }
  
    const verificationLink = `${req.protocol}://${req.get('host')}/auth/verify-email?email=${email}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        text: `Click this link to verify your email: ${verificationLink}`,
    };

    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ error: 'Failed to send verification email' });
        return res.status(201).json({ message: 'Registration successful, please check your email for verification link' });
    });

    // res.status(201).json({ message: 'User registered successfully' });
  };

//   
const AuthController = {
    register: async(email, password) => {
        const { email, password } = req.body;
        const { data, error } = await UserModel.create(email, password);

        if (error) return res.status(400).json({ error: error.message });

        const verificationLink = `${req.protocol}://${req.get('host')}/auth/verify-email?email=${email}`;
        
        

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json({ error: 'Failed to send verification email' });
            return res.status(201).json({ message: 'Registration successful, please check your email for verification link' });
        });
    },
    

    static async verifyEmail(req, res) {
        const { email } = req.query;
        const { data, error } = await UserModel.verifyUser(email);

        if (error || !data.length) return res.status(400).json({ error: 'Invalid or expired verification link' });
        
        return res.status(200).json({ message: 'Email verified successfully' });
    }
}
module.exports = AuthController;
