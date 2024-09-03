require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const bcrypt =require('bcryptjs');
const nodemailer = require('nodemailer');

const JWT_SECRET= process.env.JWT_TOKEN;
const EMAIL_USER= process.env.supabaseEmailUser;
const EMAIL_PASS= process.env.supabaseEmail;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const {username, email, password } = req.body;
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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const { data: user, error } = await User.findByEmail(email);
  if (error || !user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const sessionId = Math.random().toString(36).substring(2, 15);
  const accessToken = jwt.sign({ userId: user.userid, sessionId }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ accessToken });
};
