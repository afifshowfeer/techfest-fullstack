require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { requestLogger, notFound, errorHandler } = require('./middleware/errorMiddleware');

// ─── Route imports ────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth');
const eventRoutes        = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

// ─── App setup ────────────────────────────────────────────────────────────────
const app = express();

// Allow any localhost origin (Vite uses 5173, CRA uses 3000, etc.)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl) or any localhost
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse incoming JSON bodies
app.use(express.json());

// Log every request to the terminal
app.use(requestLogger);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'TechFest 2026 API is running.' });
});

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Database + Server start ──────────────────────────────────────────────────
const PORT     = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

