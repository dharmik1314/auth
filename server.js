const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./model');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Start the server and connect to the database
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all defined models to the DB. This creates tables if they don't exist.
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});


// Registration Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the submitted password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If credentials are valid, create the JWT payload
    const payload = {
      user: {
        id: user.id, 
      },
    };

   
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Profile Route - Protected by the authMiddleware
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
       const user = await User.findByPk(req.user.id, {
      // Exclude the password hash from the returned user object for security
      attributes: { exclude: ['password','createdAt','updatedAt'] } 
    });
    
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


