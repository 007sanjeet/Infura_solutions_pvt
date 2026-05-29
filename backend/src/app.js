require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

// ---------------- UPLOADS DIRECTORY ---------------- //
// Always resolve from project root
const uploadsDir = path.resolve(process.cwd(), 'uploads');

// Create uploads folder if missing
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('Serving uploads from:', uploadsDir);

// ---------------- MIDDLEWARE ---------------- //
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan('dev'));

// ---------------- STATIC FILES ---------------- //
// Access file like:
// http://localhost:5000/uploads/media/file.jpg
app.use('/uploads', express.static(uploadsDir));

// ---------------- DEBUG ROUTE ---------------- //
// Temporary debug route to verify uploads folder
app.get('/debug-upload', (req, res) => {
  const mediaFolder = path.join(uploadsDir, 'media');

  const exists = fs.existsSync(mediaFolder);

  let files = [];

  if (exists) {
    files = fs.readdirSync(mediaFolder);
  }

  res.json({
    uploadsDir,
    mediaFolder,
    exists,
    files,
  });
});

// ---------------- ROUTES ---------------- //
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

// ---------------- BASE ROUTE ---------------- //
app.get('/', (req, res) => {
  res.send('Infura Solutions Backend Running...');
});

// ---------------- HEALTH CHECK ---------------- //
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Infura Solutions API is active.',
  });
});

// ---------------- 404 HANDLER ---------------- //
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// ---------------- ERROR HANDLER ---------------- //
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;