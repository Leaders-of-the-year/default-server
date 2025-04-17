const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { randomUUID } = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const getRoleId = (type) => {
  const roleMapping = {
    'doctor_general': 1,
    'doctor_specialty': 2,
    'patient': 3
  };
  return roleMapping[type] || 3;  // Default to patient if invalid type
};

router.post('/register', async (req, res) => {
  const {
    type,
    username,
    email,
    password,
    first_name,
    last_name,
    preferred_name,
    phone_number,
    date_of_birth,
    gender,
    emergency_contact,
    address_line1,
    city,
    state,
    country,
    postal_code,
    chief_complaint,
    allergies,
    current_medications,
    chronic_conditions,
    preferred_language,
    specialty_name,
    doctor_number,
    years_of_experience,
    description,
    available,
  } = req.body;

  try {
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const numberCheckGeneral = await pool.query(
      'SELECT 1 FROM doctor_general WHERE doctor_number = $1',
      [doctor_number]
    );
    
      if (numberCheckGeneral.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Doctor number already in use' });
      }
    
    const numberCheckSpecial = await pool.query(
      'SELECT 1 FROM doctor_specialty WHERE doctor_number = $1',
      [doctor_number]
    );
  
    if (numberCheckSpecial.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Doctor number already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleId = getRoleId(type);

    const userInsert = await pool.query(
      `INSERT INTO users (username, email, "password", role_id)
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id`,
      [username, email, hashedPassword, roleId]
    );

    const userId = userInsert.rows[0].id;

    if (type === 'patient') {
      const uuidHex = randomUUID().replace(/-/g, '');
      const buffer = Buffer.from(uuidHex, 'hex');
      const base64url = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const patientId = `PAT-${base64url}`;

      const emergencyContactJson = emergency_contact ? JSON.stringify(emergency_contact) : null;
      const allergiesArray = allergies ? (Array.isArray(allergies) ? allergies : [allergies]) : null;
      const medicationsArray = current_medications ? (Array.isArray(current_medications) ? current_medications : [current_medications]) : null;
      const conditionsArray = chronic_conditions ? (Array.isArray(chronic_conditions) ? chronic_conditions : [chronic_conditions]) : null;
      const genderArray = gender ? (Array.isArray(gender) ? gender : [gender]) : null;

      const profileInsert = await pool.query(
        `INSERT INTO patients (
          patient_id,
          user_id,
          first_name,
          last_name,
          preferred_name,
          date_of_birth,
          gender,
          email,
          phone_number,
          emergency_contact,
          chief_complaint,
          allergies,
          current_medications,
          chronic_conditions,
          address_line1,
          city,
          state,
          country,
          postal_code,
          preferred_language,
          created_at,
          updated_at,
          is_active
          
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true
        ) RETURNING *`,
        [
          patientId,
          userId,
          first_name,
          last_name,
          preferred_name || null,
          date_of_birth || null,
          genderArray,
          email,
          phone_number || null,
          emergencyContactJson,
          chief_complaint || null,
          allergiesArray,
          medicationsArray,
          conditionsArray,
          address_line1 || null,
          city || null,
          state || null,
          country || null,
          postal_code || null,
          preferred_language || null
        ]
      );

      return res.status(201).json({ success: true, user: userInsert.rows[0], profile: profileInsert.rows[0] });
    
    } else if (type === 'doctor_general') {
      const numberCheckGeneral = await pool.query(
        'SELECT 1 FROM doctor_general WHERE doctor_number = $1',
        [doctor_number]
      );
    
    
    
      if (numberCheckGeneral.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Doctor number already in use' });
      }
    
      const profileInsert = await pool.query(
        `INSERT INTO doctor_general (
          first_name,
          last_name,
          doctor_number,
          years_of_experience,
          user_id,
          address_line1,
          state,
          postal_code,
          preferred_language
          
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          first_name || null,
          last_name || null,
          doctor_number,
          years_of_experience || null,
          userId,
          address_line1 || null,
          state || null,
          postal_code || null,
          preferred_language || null
        ]
      );
    
      return res.status(201).json({
        success: true,
        user: userInsert.rows[0],
        profile: profileInsert.rows[0]
      });
    
    
} else if (type === 'doctor_specialty') {

  const numberCheckSpecial = await pool.query(
    'SELECT 1 FROM doctor_specialty WHERE doctor_number = $1',
    [doctor_number]
  );

  if (numberCheckSpecial.rows.length > 0) {
    return res.status(400).json({ success: false, message: 'Doctor number already in use' });
  }
  const profileInsert = await pool.query(
    `INSERT INTO doctor_specialty (
      first_name,
      last_name,
      specialty_name,
      doctor_number,
      description,
      user_id,
      address_line1,
      state,
      postal_code,
      preferred_language,
      years_of_experience,
      available
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      first_name || null,
      last_name || null,
      specialty_name,
      doctor_number,
      description || null,
      userId,
      address_line1 || null,
      state || null,
      postal_code || null,
      preferred_language || null,
      years_of_experience || null,
      false  // Make sure to pass false here for the available boolean field
    ]
  );
  

  return res.status(201).json({
    success: true,
    user: userInsert.rows[0],
    profile: profileInsert.rows[0]
  });
}

    
    
    else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login Route - use shared users table
const getRoleType = (roleId) => {
  const mapping = {
    1: 'doctor_general',
    2: 'doctor_specialty',
    3: 'patient'
  };
  return mapping[roleId] || 'unknown';
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // 👇 Map role_id to role string
    const role = getRoleType(user.role_id);

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;