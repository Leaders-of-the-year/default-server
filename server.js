const express = require('express');
const https = require('https');
const { Server } = require('socket.io');
const fs = require('fs');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER || 'mehdi',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'doctori_db',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Connection error', err));

// HTTPS certificates
const options = {
  key: fs.readFileSync('key.pem', 'utf8'),
  cert: fs.readFileSync('cert.pem', 'utf8'),
};

// Create HTTPS server
const server = https.createServer(options, app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// ✅ Import and run video call socket logic
require('./socket/videoCall')(io);

// Basic Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Routes
const authRoutes = require('./routes/auth');
const doctorGeneralRoutes = require('./routes/doctorGeneral');
const patientRoutes = require('./routes/patients');
const doctorSpecialtyRoutes = require('./routes/doctorSpecialty');

app.use('/api/auth', authRoutes);
app.use('/api', doctorGeneralRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api', doctorSpecialtyRoutes);

// Start Server
server.listen(3001, '192.168.74.215', () => {
  console.log('🚀 Server running at https://192.168.74.215:3001');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
