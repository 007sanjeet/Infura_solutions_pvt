require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 5000;

// ---------------- CREATE UPLOAD FOLDERS ---------------- //
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const mediaDir = path.join(uploadsDir, 'media');

// Create uploads folder if not exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create media folder if not exists
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

console.log('Uploads Folder:', uploadsDir);
console.log('Media Folder:', mediaDir);

// ---------------- MIDDLEWARE ---------------- //
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ---------------- STATIC FILES ---------------- //
// Access files using:
// http://localhost:5000/uploads/media/file.jpg
app.use('/uploads', express.static(uploadsDir));

// ---------------- DEBUG ROUTE ---------------- //
app.get('/debug-upload', (req, res) => {
  try {
    const files = fs.existsSync(mediaDir)
      ? fs.readdirSync(mediaDir)
      : [];

    res.status(200).json({
      uploadsDir,
      mediaDir,
      exists: fs.existsSync(mediaDir),
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ---------------- ROUTE IMPORTS ---------------- //
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const jobsRoutes = require('./routes/jobs');
const categoriesRoutes = require('./routes/categories');
const bannersRoutes = require('./routes/banners');
const applicationsRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');
const testimonialsRoutes = require('./routes/testimonials');

// ---------------- HOME ROUTE ---------------- //
app.get('/', (req, res) => {
  res.send('Infura Solutions Backend Running...');
});

// ---------------- ADMIN TEST ROUTE ---------------- //
app.get('/api/admin', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API Working Successfully',
  });
});

// ---------------- HEALTH CHECK ---------------- //
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Infura Solutions API is active.',
  });
});

// ---------------- API ROUTES ---------------- //
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/testimonials', testimonialsRoutes);

// ---------------- 404 HANDLER ---------------- //
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// ---------------- SERVER START ---------------- //
async function startServer() {
  try {
    await prisma.$connect();

    console.log(
      'Successfully connected to PostgreSQL database.'
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Error starting server:',
      error
    );

    process.exit(1);
  }
}

// ---------------- GRACEFUL SHUTDOWN ---------------- //
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();

    console.log(
      'Database disconnected. Exiting...'
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

// ---------------- START APP ---------------- //
startServer();