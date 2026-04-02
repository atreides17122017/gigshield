import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_hackathon_secret_9921';

// REGISTER
router.post('/register', async (req, res) => {
  console.log('======= REGISTER ATTEMPT HITTING Route =======');
  console.log('Payload Received:', req.body);
  try {
    const { name, email, phone, upi, platform, zone, working_hours, password } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Missing required fields', data: null });
    }

    // Check if email exists properly
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Registration failed: Email already exists in system', data: null });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Dynamic Zone Mapping (fallbacks safely)
    const [zoneRecords] = await db.query('SELECT id FROM zones WHERE area_name LIKE ? OR city LIKE ?', [`%${zone}%`, `%${zone}%`]);
    const zone_id = zoneRecords.length > 0 ? zoneRecords[0].id : 1; 

    // Calculate core metrics natively
    const daily_income = working_hours ? working_hours * 80 : 500;
    const trust_score = 50;
    const tenure_days = 0;

    const [result] = await db.query(
      `INSERT INTO users (email, password_hash, name, phone, upi, platform, zone_id, daily_income, working_hours, trust_score, tenure_days)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, passwordHash, name, phone || null, upi || null, platform || 'Zomato', zone_id, daily_income, working_hours || 8, trust_score, tenure_days]
    );

    const userObj = {
      id: result.insertId,
      email,
      name,
      phone,
      upi,
      platform,
      zone_id,
      daily_income,
      working_hours,
      trust_score,
      tenure_days
    };

    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Registration successful', data: userObj, token, user: userObj });
  } catch (error) {
    console.error('--- REGISTRATION FATAL ERROR ---');
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration', data: null });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing login credentials', data: null });

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password', data: null });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password', data: null });
    }

    const userObj = {
      id: user.id,
      email: user.email,
      name: user.name,
      platform: user.platform,
      zone_id: user.zone_id,
      daily_income: user.daily_income,
      working_hours: user.working_hours,
      trust_score: user.trust_score,
      tenure_days: user.tenure_days
    };

    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Login successful', data: userObj, token, user: userObj });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', data: null });
  }
});

// GET ME
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, name, platform, zone_id, daily_income, working_hours, trust_score, tenure_days FROM users WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }
    res.json({ success: true, message: 'User profile fetched', data: users[0], user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile', data: null });
  }
});

export default router;
