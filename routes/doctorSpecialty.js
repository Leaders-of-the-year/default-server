const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../config/db');  
const authenticateToken = require('../middlewares/authMiddleware'); 
const authenticateRole = require('../middlewares/authenticateRole'); 

// Route for fetching the doctor's profile 
router.get('/doctor_profile', authenticateToken, async (req, res) => {
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

// Route for creating a new doctor specialty (only accessible by doctor_special role)
router.post('/doctor_specialty/new', authenticateToken, async (req, res) => {
  const { doctor_id, first_name, last_name, specialty_name, doctor_number, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO doctor_specialty (doctor_id, first_name, last_name, specialty_name, doctor_number, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [doctor_id, first_name, last_name, specialty_name, doctor_number, description]
    );
    
    res.status(201).json({ success: true, doctor_specialty: result.rows[0] });
  } catch (err) {
    console.error('Error inserting doctor specialty:', err);    
    res.status(500).json({ success: false, error: err.message });
  }
});



// Route to fetch all doctor specialties 
router.get('/doctor_specialty', authenticateToken, async (req, res) => {
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
router.get('/patient/id/:id', authenticateToken, async (req, res) => {
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
  const { patient_id, first_name, last_name, phone_number, address, gender, medical_info } = req.body;

  if (!patient_id) {
    return res.status(400).json({ success: false, message: 'Patient ID is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE patients
       SET first_name = $1, last_name = $2, phone_number = $3, address = $4, gender = $5, medical_info = $6
       WHERE patient_id = $7
       RETURNING *`,
      [first_name, last_name, phone_number, address, gender, medical_info || null, patient_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({
      success: true,
      patient: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.put('/doctor_profile/update', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, doctor_number, specialty_name, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE doctor_specialty
       SET first_name = $1, 
           last_name = $2, 
           doctor_number = $3, 
           specialty_name = $4, 
           description = $5
       WHERE user_id = $6
       RETURNING *`,
      [first_name, last_name, doctor_number, specialty_name, description || null, userId]
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
router.get('/doctor_specialty/id/:id', authenticateToken, async (req, res) => {
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

router.get('/doctor_general/id/:id', authenticateToken, async (req, res) => {
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

module.exports = router;
