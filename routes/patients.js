const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../config/db');  

const authenticateToken = require('../middlewares/authMiddleware'); 


// GET route to fetch a logged-in patient's profile
router.get('/patient/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Assuming user info is added to req.user after JWT verification

  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({
      success: true,
      patient: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching patient profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT route to update a patient's profile this works and it's tested
router.put('/patient/profile/update', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get user_id from JWT
  const {
   
    first_name,
    last_name,
    preferred_name,
    date_of_birth,
    gender,
    phone_number,
    emergency_contact,
    chief_complaint,
    vital_signs,
    height_cm,
    weight_kg,
    bmi,
    allergies,
    current_medications,
    chronic_conditions,
    consultation_notes,
    assessment,
    plan,
    follow_up_instructions,
    blood_type,
    address_line1,
    city,
    state,
    country,
    postal_code,
    insurance_info,
    past_medical_history,
    family_medical_history,
    lifestyle,
    preferred_language,
    accessibility_needs,
    next_appointment,
    follow_up_reason,
    referrals,
    prescriptions
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE patients SET
        first_name = $1,
        last_name = $2,
        preferred_name = $3,
        date_of_birth = $4,
        gender = $5,
        phone_number = $6,
        emergency_contact = $7,
        chief_complaint = $8,
        vital_signs = $9,
        height_cm = $10,
        weight_kg = $11,
        bmi = $12,
        allergies = $13,
        current_medications = $14,
        chronic_conditions = $15,
        consultation_notes = $16,
        assessment = $17,
        plan = $18,
        follow_up_instructions = $19,
        blood_type = $20,
        address_line1 = $21,
        city = $22,
        state = $23,
        country = $24,
        postal_code = $25,
        insurance_info = $26,
        past_medical_history = $27,
        family_medical_history = $28,
        lifestyle = $29,
        preferred_language = $30,
        accessibility_needs = $31,
        next_appointment = $32,
        follow_up_reason = $33,
        referrals = $34,
        prescriptions = $35,
        updated_at = CURRENT_TIMESTAMP
      
      RETURNING *`,
      [
        first_name,
        last_name,
        preferred_name,
        date_of_birth,
        gender,
        phone_number,
        emergency_contact ? JSON.stringify(emergency_contact) : null,
        chief_complaint,
        vital_signs ? JSON.stringify(vital_signs) : null,
        height_cm,
        weight_kg,
        bmi,
        Array.isArray(allergies) ? allergies : null,
        Array.isArray(current_medications) ? current_medications : null,
        Array.isArray(chronic_conditions) ? chronic_conditions : null,
        consultation_notes,
        assessment,
        plan,
        follow_up_instructions,
        blood_type,
        address_line1,
        city,
        state,
        country,
        postal_code,
        insurance_info ? JSON.stringify(insurance_info) : null,
        past_medical_history,
        family_medical_history,
        lifestyle ? JSON.stringify(lifestyle) : null,
        preferred_language,
        accessibility_needs,
        next_appointment,
        follow_up_reason,
        Array.isArray(referrals) ? referrals : null,
        Array.isArray(prescriptions) ? prescriptions.map(p => JSON.stringify(p)) : null,
        
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, patient: result.rows[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// Route to get all patient records (accessible to any authenticated user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json({ success: true, patients: result.rows });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to fetch a specific patient by ID (access control included)
router.get('/patient/id/:id', authenticateToken, async (req, res) => {
  const patientId = req.params.id;
  const requesterId = req.user.id;
  const role = req.user.role;

  // Optional: Prevent patients from accessing other patients' records
  if (role === 'patient' && requesterId !== patientId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  try {
    const result = await pool.query('SELECT * FROM patients WHERE patient_id = $1', [patientId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not cchek the id again' });
    }

    res.json({ success: true, patient: result.rows[0] });
  } catch (err) {
    console.error('Error fetching patient by ID:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ NEW: Route to fetch all doctor specialties (for dashboard "My Doctors" view)
router.get('/patient/mydoctors/all', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctor_specialty');
    res.json({ success: true, doctor_specialty: result.rows });
  } catch (err) {
    console.error('Error fetching doctor specialties:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/patient/mydoctors/search', authenticateToken,async (req, res) => {
  const doctorName = req.query.name;
  const specialtyFilter = req.query.specialty;

  console.log('Searching for doctor:', doctorName);
  console.log('Filtering by specialty:', specialtyFilter);

  try {
    let query = 'SELECT * FROM doctor_specialty';
    let values = [];
    let conditions = [];

    if (doctorName) {
      conditions.push('(first_name ILIKE $1 OR last_name ILIKE $1)');
      values.push(`%${doctorName}%`);
    }

    if (specialtyFilter) {
      conditions.push(`specialty_name ILIKE $${values.length + 1}`);
      values.push(`%${specialtyFilter}%`);
    }

    // If there are any conditions, add them to the query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No doctors found' });
    }

    res.json({
      success: true,
      doctor_specialties: result.rows
    });
  } catch (err) {
    console.error('Error fetching doctor specialties:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// for fecthing a spesefic doctor profile
router.get('/patient/mydoctors/id/:id', authenticateToken,async (req, res) => {
  const doctorId = parseInt(req.params.id); // Ensure it's a number

  if (isNaN(doctorId)) {
    return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM doctor_specialty WHERE id = $1',
      [doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor_profile: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/patient/mydoctors', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        first_name,
        last_name,
        doctor_number,
        specialty_name,
        available,
        user_id
      FROM doctor_specialty
    `);

    res.json({ success: true, doctor_specialty: result.rows });
  } catch (err) {
    console.error('Error fetching doctor specialties:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/schedule
router.post('/schedule/new', authenticateToken, async (req, res) => {
  const { doctor_id, appointment_date, reason } = req.body;
  const userId = req.user.id; // Logged-in user's ID

  try {
    // Step 1: Get the patient's actual patient_id (e.g., "PAT-xxxxx") from the profile
    const patientResult = await pool.query(
      'SELECT patient_id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const patient_id = patientResult.rows[0].patient_id;

    // Step 2: Insert appointment
    const result = await pool.query(
      `INSERT INTO schedule (doctor_id, patient_id, appointment_date, reason)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [doctor_id, patient_id, appointment_date, reason]
    );

    res.status(201).json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    console.error('Error scheduling appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



router.get('/schedule/my', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Get the real patient_id string from the profile table
    const result = await pool.query(
      'SELECT patient_id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const patientId = result.rows[0].patient_id;

    // Fetch all appointments for this patient
    const appointments = await pool.query(
      'SELECT * FROM schedule WHERE patient_id = $1 ORDER BY appointment_date ASC',
      [patientId]
    );

    res.json({ success: true, appointments: appointments.rows });
  } catch (err) {
    console.error('Error fetching patient schedule:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// PUT /api/schedule/patient/:id/status
router.put('/schedule/patient/:id/status', authenticateToken, async (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;
  const userId = req.user.id; // This is the user.id, not the patient_id

  try {
    // Get the patient_id from the patients table based on the user.id
    const patientResult = await pool.query(
      'SELECT patient_id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const patientId = patientResult.rows[0].patient_id;

    // Confirm the appointment belongs to the patient
    const appointmentCheck = await pool.query(
      'SELECT * FROM schedule WHERE id = $1 AND patient_id = $2',
      [appointmentId, patientId]
    );

    if (appointmentCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this appointment' });
    }

    // Update the status
    const update = await pool.query(
      `UPDATE schedule SET status = $1 WHERE id = $2 RETURNING *`,
      [status, appointmentId]
    );

    res.json({ success: true, appointment: update.rows[0] });

  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// PUT /api/schedule/patient/:id/reschedule
router.put('/schedule/patient/:id/reschedule', authenticateToken, async (req, res) => {
  const appointmentId = req.params.id;
  const { appointment_date } = req.body; // New appointment date
  const userId = req.user.id; // This is the user.id, not the patient_id

  try {
    // Get the patient_id from the patients table based on the user.id
    const patientResult = await pool.query(
      'SELECT patient_id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const patientId = patientResult.rows[0].patient_id;

    // Confirm the appointment belongs to the patient
    const appointmentCheck = await pool.query(
      'SELECT * FROM schedule WHERE id = $1 AND patient_id = $2',
      [appointmentId, patientId]
    );

    if (appointmentCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized to reschedule this appointment' });
    }

    // Reschedule the appointment by updating the appointment_date
    const update = await pool.query(
      `UPDATE schedule SET appointment_date = $1 WHERE id = $2 RETURNING *`,
      [appointment_date, appointmentId]
    );

    res.json({ success: true, appointment: update.rows[0] });

  } catch (err) {
    console.error('Error rescheduling appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});






module.exports = router;
