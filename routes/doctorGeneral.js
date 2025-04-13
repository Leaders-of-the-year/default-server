const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('../config/db');
const cors = require('cors');
const authenticateToken = require('../middlewares/authMiddleware');
const authenticateRole = require('../middlewares/authenticateRole');

require('dotenv').config();

router.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

router.post('/doctor_general/new', authenticateToken, authenticateRole('doctor_general'), async (req, res) => {
  const { first_name, last_name, doctor_number, years_of_experience } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO doctor_general 
       (first_name, last_name, doctor_number, years_of_experience) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [first_name, last_name, doctor_number, years_of_experience]
    );
    res.status(201).json({ success: true, doctor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/doctor_general', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctor_general');
    res.json({ success: true, doctors: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/doctor_profile', authenticateToken , async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM doctor_general WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, doctor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/mypatients', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json({ success: true, patients: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/mypatients/search', authenticateToken, async (req, res) => {
  const searchTerm = req.query.q?.trim();

  if (!searchTerm) {
    return res.status(400).json({ success: false, message: 'Search term is required' });
  }

  try {
    const query = `
      SELECT * FROM patients 
      WHERE first_name ILIKE $1 
         OR last_name ILIKE $1 
         OR patient_id ILIKE $1
    `;
    const values = [`%${searchTerm}%`];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No patients found' });
    }

    res.json({
      success: true,
      patients: result.rows
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/doctor_profile/update', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, doctor_number, years_of_experience } = req.body;

  try {
    const result = await pool.query(
      `UPDATE doctor_general
       SET first_name = $1, last_name = $2, doctor_number = $3, years_of_experience = $4
       WHERE user_id = $5
       RETURNING *`,
      [first_name, last_name, doctor_number, years_of_experience || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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

module.exports = router;
