const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'development'
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : [process.env.CLIENT_URL];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/work', require('./routes/work'));
app.use('/api/reflection', require('./routes/reflection'));
app.use('/api/badge', require('./routes/badge'));
app.use('/api/goal', require('./routes/goal'));
app.use('/api/feedback', require('./routes/feedback'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));