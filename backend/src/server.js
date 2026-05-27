require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ---------------- //
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ---------------- ROUTE IMPORTS ---------------- //
// FIXED PATHS (removed extra /src)
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
    // Connect PostgreSQL
    await prisma.$connect();

    console.log(
      'Successfully connected to PostgreSQL database.'
    );

    app.listen(PORT, () => {
      console.log(
        `Server running in development mode on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Error starting server or connecting database:',
      error
    );

    process.exit(1);
  }
}

// ---------------- GRACEFUL SHUTDOWN ---------------- //
process.on('SIGINT', async () => {
  await prisma.$disconnect();

  console.log(
    'Database disconnected. Exiting...'
  );

  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// ---------------- START APP ---------------- //
startServer();