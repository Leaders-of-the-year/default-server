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






module.exports = router;
