import express from 'express';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.query('SELECT name, platform, zone_id, daily_income, working_hours, trust_score, tenure_days FROM users WHERE id = ?', [userId]);
    const user = users[0];

    const [zones] = await db.query('SELECT * FROM zones WHERE id = ?', [user.zone_id]);
    const zone = zones[0];

    // Active Policy
    const [policies] = await db.query(
      `SELECT * FROM policies 
       WHERE user_id = ? 
       AND status = 'active' 
       AND end_date >= date('now', 'localtime')`,
      [userId]
    );
    const policy = policies.length > 0 ? policies[0] : null;

    // Claims Stats
    const [claimsList] = await db.query(
      `SELECT c.* FROM claims c
       JOIN policies p ON c.policy_id = p.id
       WHERE p.user_id = ? ORDER BY c.created_at DESC`,
      [userId]
    );
    
    let totalPaid = 0;
    let hoursProtected = 0;
    claimsList.forEach(c => {
      hoursProtected += c.disruption_hours || 0;
      if (c.status === 'approved' || c.status === 'payout_success') {
        totalPaid += c.amount || 0;
      }
    });

    const [notifs] = await db.query('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userId]);

    res.json({
      success: true,
      message: 'Dashboard telemetry loaded',
      data: {
        user: {
          name: user.name,
          platform: user.platform,
          zone: zone.area_name || zone.city,
          trust_score: user.trust_score
        },
        policy: policy,
        risk: {
          last_recorded_rain: 12.0, // Should pipe from triggers_log realistically
          last_recorded_aqi: 210,
          temp: 34
        },
        claims: claimsList.slice(0, 5),
        notifications: { unread_count: notifs.length ? notifs[0].count : 0 },
        stats: { total_paid: totalPaid, claims_count: claimsList.length, hours_protected: hoursProtected }
      }
    });

  } catch (error) {
    console.error('Fetch Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard aggregation', data: null });
  }
});

export default router;
