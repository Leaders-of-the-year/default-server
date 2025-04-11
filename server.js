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

// ✅ Fixed: Use `Server` (not `SocketIOServer`)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// In-memory storage
const doctors = new Map(); // socket.id => { isBusy, patientId }
const waitingPatients = new Set(); // Set of socket ids

function checkWaitingPatients() {
  if (waitingPatients.size === 0) return;

  for (const [docId, docState] of doctors) {
    if (!docState.isBusy) {
      const patientId = [...waitingPatients][0]; // Get first patient
      io.to(docId).emit('patient-waiting', patientId);
      break;
    }
  }
}

function endCall(socketId) {
  const doctor = doctors.get(socketId);

  if (doctor?.patientId) {
    io.to(doctor.patientId).emit('call-ended');
    doctors.set(socketId, { isBusy: false, patientId: null });
  }

  for (const [docId, docState] of doctors) {
    if (docState.patientId === socketId) {
      doctors.set(docId, { isBusy: false, patientId: null });
      io.to(docId).emit('call-ended');
    }
  }
}

io.on('connection', (socket) => {
  const role = socket.handshake.query.role;
  console.log(`🔌 New connection: ${socket.id} with role: ${role}`);

  socket.on('register-doctor', () => {
    doctors.set(socket.id, { isBusy: false, patientId: null });
    console.log('👨‍⚕️ Doctor registered:', socket.id);
    checkWaitingPatients();
  });

  socket.on('request-call', () => {
    waitingPatients.add(socket.id);
    socket.emit('call-status', 'waiting');
    console.log('🧑‍💼 Patient requesting call:', socket.id);
    checkWaitingPatients();
  });

  socket.on('accept-patient', (patientId) => {
    const doctor = doctors.get(socket.id);
    if (!doctor || doctor.isBusy || !waitingPatients.has(patientId)) {
      socket.emit('call-error', 'Unable to accept call');
      return;
    }

    doctors.set(socket.id, { isBusy: true, patientId });
    waitingPatients.delete(patientId);

    io.to(patientId).emit('call-accepted', socket.id);
    socket.emit('call-accepted', patientId);
    console.log(`✅ Call connected: ${socket.id} ⇄ ${patientId}`);
  });

  // WebRTC Signaling
  socket.on('send-offer', ({ offer, to }) => {
    io.to(to).emit('receive-offer', { offer, from: socket.id });
  });

  socket.on('send-answer', ({ answer, to }) => {
    io.to(to).emit('receive-answer', { answer, from: socket.id });
  });

  socket.on('send-ice-candidate', ({ candidate, to }) => {
    io.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
  });

  socket.on('end-call', () => {
    endCall(socket.id);
    console.log('📞 Call ended by:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id);
    endCall(socket.id);
    doctors.delete(socket.id);
    waitingPatients.delete(socket.id);
    checkWaitingPatients();
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

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

// Routes
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
  console.log('🚀 Server running at https://localhost:3001');
});
