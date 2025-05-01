const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token , user:{id: user._id, username: user.username, email:user.email, role:user.role}});
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Admin creation route (one-time)
const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if the admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      xp: 0,
      badges: [],
      level: 1,
      profilePicture: 'default.png',
      completedContents: [],
      ongoingContents: [],
      createdAt: new Date(),
    });

    // Save the admin user
    await newAdmin.save();

    return res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating admin user' });
  }
};


module.exports = {
    signup,
    login,
    createAdmin
    
};
