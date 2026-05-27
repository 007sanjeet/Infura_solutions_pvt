const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Create upload directory if not exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files for uploaded images & resumes
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/content', require('./routes/content'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/media', require('./routes/media'));
app.use('/api/settings', require('./routes/settings'));

// Base route / health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Infura Solutions API is active.' });
});

// Centralized error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
