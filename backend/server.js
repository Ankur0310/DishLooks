const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

const __dirName = path.resolve();

// CORS setup for development
app.use(cors({ origin: 'https://dishlooks.onrender.com' }));
app.options('*', cors());

app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected to Atlas'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Define API routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const dishRoutes = require('./routes/dishes');
app.use('/api/dishes', dishRoutes);

app.use('/uploads', express.static(path.join(__dirName, 'uploads')));

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurant', restaurantRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/order', orderRoutes);

// Serve static files from the React frontend build folder
app.use(express.static(path.join(__dirName, '/frontend/build')));

// Handle any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirName, 'frontend', 'build', 'index.html'));
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
