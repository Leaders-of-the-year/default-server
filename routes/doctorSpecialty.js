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
    const result = await pool.query('SELECT * FROM doctor_general_profile WHERE doctor_id = $1', [userId]);
    
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
router.post('/doctor_specialty', authenticateToken, async (req, res) => {
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









module.exports = router;
