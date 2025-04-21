const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../config/db');  
const authenticateToken = require('../middlewares/authMiddleware'); 
const authenticateRole = require('../middlewares/authenticateRole'); 

// Route for fetching the doctor's profile 
router.get('/doctor_profile', authenticateToken, authenticateRole('doctor_special'),async (req, res) => {
  const userId = req.user.id;  
  
  try {
    const result = await pool.query('SELECT * FROM doctor_specialty WHERE user_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    
    res.json({ success: true, doctorProfile: result.rows[0] });
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});




// Route to fetch all doctor specialties 
router.get('/doctor_specialty', authenticateToken, authenticateRole('doctor_special'),async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctor_specialty');
    res.json({ success: true, doctor_specialties: result.rows });
  } catch (err) {
    console.error('Error fetching doctor specialties:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//to fetch every patient works
router.get('/mypatients', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json({ success: true, patients: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
//fetch patient with patient id 
router.get('/patient/id/:id', authenticateToken, authenticateRole('doctor_special'),async (req, res) => {
  const patientId = req.params.id;
  const requesterId = req.user.id;
  const role = req.user.role;

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
    res.status(500).json({ success: false, error: err.message });
  }
});


router.put('/patient_profile/update', authenticateToken, async (req, res) => {
  const {
    patient_id, // Used to locate the record
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
  if (!patient_id) {
    return res.status(400).json({ success: false, message: 'Patient ID is required' });
  }
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
      WHERE patient_id = $36
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
        patient_id // <-- Now this is used to find the patient
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



router.put('/doctor_profile/update', authenticateToken, authenticateRole('doctor_special'), async (req, res) => {
  const userId = req.user.id;
  const {
    first_name,
    last_name,
    doctor_number,
    specialty_name,
    description,
    address_line1,
    state,
    postal_code,
    preferred_language,
    years_of_experience,
    available,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE doctor_specialty
       SET first_name = $1,
           last_name = $2,
           doctor_number = $3,
           specialty_name = $4,
           description = $5,
           address_line1 = $6,
           state = $7,
           postal_code = $8,
           preferred_language = $9,
           years_of_experience = $10,
           available = $11
       WHERE user_id = $12
       RETURNING *`,
      [
        first_name || null,
        last_name || null,
        doctor_number,
        specialty_name,
        description || null,
        address_line1 || null,
        state || null,
        postal_code || null,
        preferred_language || null,
        years_of_experience || null,
        available || false,  // Ensure available is a boolean
        userId  // userId should be at the end
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating doctor profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// works and tested
router.get('/doctor_specialty/id/:id', authenticateToken,authenticateRole('doctor_special'), async (req, res) => {
  const doctorId = parseInt(req.params.id);

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
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/doctor_general/id/:id', authenticateToken, authenticateRole('doctor_special'),async (req, res) => {
  const doctorId = parseInt(req.params.id);

  if (isNaN(doctorId)) {
    return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM doctor_general WHERE id = $1',
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
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/doctor_profile/availability', authenticateToken, authenticateRole('doctor_special'), async (req, res) => {
  const userId = req.user.id;
  const { available } = req.body;  // Only the 'available' field is expected

  try {
    // Update only the 'available' field for the doctor_specialty
    const result = await pool.query(
      `UPDATE doctor_specialty
       SET available = $1
       WHERE user_id = $2
       RETURNING *`,
      [
        available,  // The boolean value for availability (true or false)
        userId  // The user ID to identify which doctor to update
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating doctor availability:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


router.post('/schedule/new', authenticateToken, authenticateRole('doctor_special'), async (req, res) => {
  const { patient_id, appointment_date, reason } = req.body;
  const doctor_id = req.user.id;  // Get doctor ID from the authenticated user (JWT token)

  // Basic validation
  if (!patient_id || !appointment_date) {
    return res.status(400).json({ success: false, message: 'Patient ID and appointment date are required' });
  }

  try {
    // Check if the patient exists
    const patientResult = await pool.query('SELECT * FROM patients WHERE patient_id = $1', [patient_id]);
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Check if the doctor exists
    const doctorResult = await pool.query('SELECT * FROM users WHERE id = $1 AND role_id = 2', [doctor_id]);  // role_id = 2 for 'doctor_specialty'
    if (doctorResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found or unauthorized' });
    }

    // Check if the doctor already has an appointment scheduled at the given time
    const scheduleConflict = await pool.query(
      'SELECT * FROM schedule WHERE doctor_id = $1 AND appointment_date = $2',
      [doctor_id, appointment_date]
    );
    if (scheduleConflict.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Doctor already has an appointment scheduled at this time' });
    }

    // Insert the new appointment into the schedule table
    const result = await pool.query(
      `INSERT INTO schedule (doctor_id, patient_id, appointment_date, reason , emergency)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [doctor_id, patient_id, appointment_date, reason || null]
    );

    // Return the scheduled appointment
    res.status(201).json({
      success: true,
      appointment: result.rows[0],
    });

  } catch (err) {
    console.error('Error scheduling appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/schedule', authenticateToken, authenticateRole('doctor_special'), async (req, res) => {
  const doctorId = req.user.id; // This is the user_id of the doctor

  try {
    const result = await pool.query(
      `SELECT s.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name
       FROM schedule s
       JOIN patients p ON s.patient_id = p.patient_id
       WHERE s.doctor_id = $1 AND s.appointment_date > CURRENT_TIMESTAMP
       ORDER BY s.appointment_date ASC`,
      [doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No upcoming appointments found' });
    }

    res.json({
      success: true,
      schedule: result.rows
    });
  } catch (err) {
    console.error('Error fetching doctor schedule:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



router.put('/schedule/id/:appointmentId/status', authenticateToken, authenticateRole('doctor_special'), async (req, res) => {
  const doctorId = req.user.id; // Get the logged-in doctor's ID
  const { appointmentId } = req.params; // Get the appointment ID from the URL parameter
  const { status } = req.body; // Get the new status from the request body

  // Validate the status to ensure it's one of the accepted values
  const validStatuses = ['scheduled', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    // Check if the appointment exists and belongs to the logged-in doctor
    const result = await pool.query(
      `SELECT * FROM schedule WHERE id = $1 AND doctor_id = $2`,
      [appointmentId, doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found or does not belong to this doctor' });
    }

    // Update the status of the appointment
    const updateResult = await pool.query(
      `UPDATE schedule
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, appointmentId]
    );

    res.json({
      success: true,
      appointment: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// DELETE /api/schedule/:id
router.delete('/schedule/:id',authenticateToken,authenticateRole('doctor_special'),async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    try {
      // Verify that the appointment belongs to the requesting doctor
      const check = await pool.query(
        'SELECT * FROM schedule WHERE id = $1 AND doctor_id = $2',
        [appointmentId, userId]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found or not authorized',
        });
      }

      // Delete the appointment
      await pool.query('DELETE FROM schedule WHERE id = $1', [appointmentId]);

      res.json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting appointment:', err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

router.put('/schedule/:id/reschedule',authenticateToken,authenticateRole('doctor_special'),async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const { new_appointment_date } = req.body;

    if (!new_appointment_date) {
      return res.status(400).json({
        success: false,
        message: 'New appointment date is required',
      });
    }

    try {
      // Ensure the appointment belongs to the doctor making the request
      const check = await pool.query(
        'SELECT * FROM schedule WHERE id = $1 AND doctor_id = $2',
        [appointmentId, userId]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found or not authorized',
        });
      }

      // Reschedule the appointment
      await pool.query(
        `UPDATE schedule
         SET appointment_date = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [new_appointment_date, appointmentId]
      );

      res.json({
        success: true,
        message: 'Appointment rescheduled successfully',
        new_date: new_appointment_date,
      });
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);


router.get('/schedule/history', authenticateToken, async (req, res) => {
  const doctorId = req.user.id; // Using user.id directly as doctor_id

  try {
    const result = await pool.query(
      `SELECT * FROM schedule
       WHERE doctor_id = $1 AND (
         (status = 'completed' AND appointment_date < NOW()) OR
         status = 'cancelled'
       )
       ORDER BY appointment_date DESC`,
      [doctorId]
    );

    res.json({ success: true, history: result.rows });
  } catch (err) {
    console.error('Error fetching doctor appointment history:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get('/schedule/patients', authenticateToken, authenticateRole('doctor_special'), async (req, res) => {
  const doctorUserId = req.user.id;

  try {
    // Step 1: Get all unique patient user_ids from schedule where doctor_id = this doctor
    const userIdsResult = await pool.query(`
      SELECT DISTINCT p.user_id
      FROM schedule s
      JOIN patients p ON s.patient_id = p.patient_id
      WHERE s.doctor_id = $1
    `, [doctorUserId]);

    const patientUserIds = userIdsResult.rows.map(row => row.user_id);

    if (patientUserIds.length === 0) {
      return res.json({ success: true, patients: [] }); // No scheduled patients
    }

    // Step 2: Get full patient records based on those user_ids
    const placeholders = patientUserIds.map((_, i) => `$${i + 1}`).join(', ');
    const patientsResult = await pool.query(
      `SELECT * FROM patients WHERE user_id IN (${placeholders})`,
      patientUserIds
    );

    res.json({ success: true, patients: patientsResult.rows });

  } catch (err) {
    console.error('Error fetching full patient data for doctor:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});





module.exports = router;



