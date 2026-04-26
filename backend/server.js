const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://root:taskmanager_0123@cluster0.rcqv2ec.mongodb.net/taskmanagerDB';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    // Create default admin and user after connection
    createDefaultUsers();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

// Function to create default users
const createDefaultUsers = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@taskmanager.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@taskmanager.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Default Admin created: admin@taskmanager.com / admin123');
    }
    
    // Check if regular user exists
    const userExists = await User.findOne({ email: 'user@taskmanager.com' });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await User.create({
        name: 'Regular User',
        email: 'user@taskmanager.com',
        password: hashedPassword,
        role: 'user',
      });
      console.log('✅ Default User created: user@taskmanager.com / user123');
    }
  } catch (error) {
    console.error('Error creating default users:', error.message);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});