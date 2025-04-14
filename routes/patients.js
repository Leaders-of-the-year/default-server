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
  const { first_name, last_name, phone_number, address, gender, medical_info } = req.body;

  try {
    const result = await pool.query(
      `UPDATE patients
       SET first_name = $1, last_name = $2, phone_number = $3, address = $4, gender = $5, medical_info = $6
       WHERE user_id = $7
       RETURNING *`,
      [first_name, last_name, phone_number, address, gender, medical_info || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found ' });
    }

    res.json({
      success: true,
      patient: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating patient profile:', err);
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
router.get('/patient/mydoctors', authenticateToken, async (req, res) => {
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






module.exports = router;
