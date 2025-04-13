const express = require('express');
const https = require('https');
const { Server } = require('socket.io');
const fs = require('fs');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

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

const options = {
  key: fs.readFileSync('key.pem', 'utf8'),
  cert: fs.readFileSync('cert.pem', 'utf8'),
};

const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

require('./socket/videoCall')(io);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// b33333333yyyyy kkjljaljlafsjljdljlfajlfjal
const authRoutes = require('./routes/auth');
const doctorGeneralRoutes = require('./routes/doctorGeneral');
const patientRoutes = require('./routes/patients');
const doctorSpecialtyRoutes = require('./routes/doctorSpecialty');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard_doctors_general', doctorGeneralRoutes);
app.use('/api/dashboard_patients', patientRoutes);
app.use('/api/dashboard_doctors_specialty', doctorSpecialtyRoutes);

server.listen(process.env.SERVER_PORT || 3001, `${process.env.SERVER_HOST}`, () => {
  console.log(`🚀 Server running at https://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
