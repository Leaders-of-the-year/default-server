// socket/videoCall.js

const doctors = new Map(); // socket.id => { isBusy, patientId }
const waitingPatients = new Set(); // socket ids

// Function to emit updated doctors list to all clients
function emitDoctorsList(io) {
  const doctorsList = Array.from(doctors.entries()).map(([id, state]) => ({
    id,
    isBusy: state.isBusy
  }));
  io.emit('doctors-list-updated', doctorsList);
}

// Function to emit waiting patients list to all clients
function emitWaitingPatientsList(io) {
  const patientsList = Array.from(waitingPatients);
  io.emit('waiting-patients-updated', patientsList);
}

function checkWaitingPatients(io) {
  if (waitingPatients.size === 0) return;
  for (const [docId, docState] of doctors) {
    if (!docState.isBusy) {
      const patientId = [...waitingPatients][0];
      io.to(docId).emit('patient-waiting', patientId);
      break;
    }
  }
}

function endCall(io, socketId) {
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

module.exports = (io) => {
  io.on('connection', (socket) => {
    const role = socket.handshake.query.role;
    console.log(`🔌 New connection: ${socket.id} with role: ${role}`);
    
    // Add endpoints for clients to request current lists
    socket.on('get-doctors-list', () => {
      const doctorsList = Array.from(doctors.entries()).map(([id, state]) => ({
        id,
        isBusy: state.isBusy
      }));
      socket.emit('doctors-list-updated', doctorsList);
    });

    socket.on('get-waiting-patients', () => {
      const patientsList = Array.from(waitingPatients);
      socket.emit('waiting-patients-updated', patientsList);
    });
    
    socket.on('register-doctor', () => {
      doctors.set(socket.id, { isBusy: false, patientId: null });
      console.log('👨‍⚕️ Doctor registered:', socket.id);
      emitDoctorsList(io);
      checkWaitingPatients(io);
    });
    
    socket.on('request-call', () => {
      waitingPatients.add(socket.id);
      socket.emit('call-status', 'waiting');
      console.log('🧑‍💼 Patient requesting call:', socket.id);
      emitWaitingPatientsList(io);
      checkWaitingPatients(io);
    });
    
    socket.on('accept-patient', (patientId) => {
      const doctor = doctors.get(socket.id);
      if (!doctor || doctor.isBusy || !waitingPatients.has(patientId)) {
        socket.emit('call-error', 'Unable to accept call');
        return;
      }
      
      doctors.set(socket.id, { isBusy: true, patientId });
      waitingPatients.delete(patientId);
      
      emitDoctorsList(io);
      emitWaitingPatientsList(io);
      
      io.to(patientId).emit('call-accepted', socket.id);
      socket.emit('call-accepted', patientId);
      console.log(`✅ Call connected: ${socket.id} ⇄ ${patientId}`);
    });
    
    // WebRTC signaling
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
      endCall(io, socket.id);
      console.log('📞 Call ended by:', socket.id);
      emitDoctorsList(io);
      emitWaitingPatientsList(io);
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Disconnected:', socket.id);
      endCall(io, socket.id);
      doctors.delete(socket.id);
      waitingPatients.delete(socket.id);
      emitDoctorsList(io);
      emitWaitingPatientsList(io);
      checkWaitingPatients(io);
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};