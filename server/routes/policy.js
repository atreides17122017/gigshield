import express from 'express';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';
import { getPersonalisedPremium } from './premium.js';

const router = express.Router();

// GET ACTIVE POLICY
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Policy is active if current date is between start_date and end_date and status = 'active'
    const [policies] = await db.query(
      `SELECT * FROM policies 
       WHERE user_id = ? 
       AND status = 'active' 
       AND end_date >= date('now', 'localtime')`,
      [userId]
    );

    if (policies.length === 0) {
      return res.json(null);
    }
    res.json(policies[0]);
  } catch (error) {
    console.error('Fetch Active Policy Error:', error);
    res.status(500).json({ error: 'Server error retrieving active policy' });
  }
});

// GET POLICY HISTORY
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [policies] = await db.query(
      `SELECT * FROM policies WHERE user_id = ? ORDER BY start_date DESC`,
      [userId]
    );
    res.json(policies);
  } catch (error) {
    console.error('Fetch Policy History Error:', error);
    res.status(500).json({ error: 'Server error retrieving policy history' });
  }
});

// SUBSCRIBE
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_tier } = req.body;

    if (!['basic', 'standard', 'premium'].includes(plan_tier)) {
      return res.status(400).json({ error: 'Invalid plan_tier specified' });
    }

    // Retrieve user and zone details for the ML model
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = users[0];

    const [zones] = await db.query('SELECT * FROM zones WHERE id = ?', [user.zone_id]);
    const zone = zones[0];

    // Fetch live individual premium dynamically from XGBoost Python bridge
    const premiumData = await getPersonalisedPremium(user, zone, plan_tier);
    const weekly_premium = premiumData.personalised_premium;

    // Create policy record
    const [result] = await db.query(
      `INSERT INTO policies (user_id, plan_tier, weekly_premium, start_date, end_date, status)
       VALUES (?, ?, ?, date('now', 'localtime'), date('now', '+7 days', 'localtime'), 'active')`,
      [userId, plan_tier, weekly_premium]
    );

    // Return created policy
    res.json({
      id: result.insertId,
      user_id: userId,
      plan_tier,
      weekly_premium,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    });
  } catch (error) {
    console.error('Subscription Error:', error);
    res.status(500).json({ error: 'Server error processing subscription' });
  }
});

export default router;
