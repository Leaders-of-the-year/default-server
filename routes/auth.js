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
    'doctor_special': 2,
    'patient': 3
  };
  return roleMapping[type] || 3;  // Default to patient if invalid type
};

router.post('/register', async (req, res) => {
  const { type, username, email, password, first_name, last_name, phone_number, address, gender, medical_info, specialty_name, doctor_number,  years_of_experience, description } = req.body;

  try {
    // Step 1: Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    
    // Step 1: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleId = getRoleId(type);
    
    // Step 2: Insert into 'users' table
    const userInsert = await pool.query(
      `INSERT INTO users (username, email, "password", role_id) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id`,
      [username, email, hashedPassword, roleId]
    );
    
    const userId = userInsert.rows[0].id;

    // Step 3: Insert into the correct profile table based on 'type'
    let profileInsert;

    switch (type) {
      case 'doctor_general':
        profileInsert = await pool.query(
          `INSERT INTO doctor_general (first_name, last_name, doctor_number, years_of_experience, user_id) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [first_name, last_name, doctor_number,  years_of_experience, userId]
        );
        break;

      case 'doctor_special':
        profileInsert = await pool.query(
          `INSERT INTO doctor_specialty (first_name, last_name, specialty_name, doctor_number, description, user_id) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [first_name, last_name, specialty_name, doctor_number, description, userId]
        );
        break;
  
        case 'patient':
          const uuidHex = randomUUID().replace(/-/g, '');  // remove dashes
  const buffer = Buffer.from(uuidHex, "hex");
  const base64 = buffer.toString("base64");
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const patientId = `PAT-${base64url}`;
  
  profileInsert = await pool.query(
    `INSERT INTO patients (first_name, last_name, email, phone_number, address, gender, patient_id, medical_info, user_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      first_name,
      last_name,
      email,  // This is already redundant and can be removed if you're storing it in the users table
      phone_number,
      address,
      gender,
      patientId,
      medical_info || null, // Allow for an empty medical_info if not provided
      userId
    ]
  );
  break;

        
      
      default:
        return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Step 4: Return the response
    res.status(201).json({ success: true, user: userInsert.rows[0], profile: profileInsert.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login Route - use shared users table
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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
