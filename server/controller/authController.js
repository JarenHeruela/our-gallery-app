require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const bcrypt =require('bcryptjs');

const JWT_SECRET= process.env.JWT_TOKEN;


exports.register = async (req, res) => {
  const {username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const { data, error } = await User.create(username, email, password);
  if (error) {
    return res.status(500).json({ message: 'User registration failed', error });
  }

  res.status(201).json({ message: 'User registered successfully' });
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
  const accessToken = jwt.sign({ userId: user.userid, sessionId }, WT_SECRET, { expiresIn: '1h' });

  res.json({ accessToken });
};
