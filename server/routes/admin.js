import express from 'express';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';
import { createClaimsForZone } from '../jobs/triggerMonitor.js';

const router = express.Router();

router.post('/trigger/manual', authenticateToken, async (req, res) => {
  try {
    const { zone_id, trigger_type, trigger_value, payout_ratio } = req.body;
    
    await createClaimsForZone(zone_id, trigger_type, trigger_value, payout_ratio || 1.0);

    // Track manual override flag if needed in DB
    const [latest] = await db.query('SELECT id FROM triggers_log ORDER BY id DESC LIMIT 1');
    if (latest.length > 0) {
        await db.query(`UPDATE triggers_log SET threshold_crossed = 1 WHERE id = ?`, [latest[0].id]);
    }

    res.json({ message: 'Manual Trigger Execution Started', zone_id, trigger_type });
  } catch (error) {
    console.error('Admin API Trigger Error:', error);
    res.status(500).json({ error: 'Failed executing manual zone trigger' });
  }
});

router.get('/trigger-status', authenticateToken, async (req, res) => {
  try {
    const [logs] = await db.query('SELECT * FROM triggers_log ORDER BY recorded_at DESC LIMIT 50');
    
    let apiStatus = {
        openweathermap: 'Stable',
        aqicn: 'Stable',
        error_counts: 0
    };

    logs.forEach(l => {
        if (l.trigger_value === 'API_UNAVAILABLE') {
            apiStatus.error_counts++;
            if (l.trigger_type.includes('weather')) apiStatus.openweathermap = 'Unstable/Unavailable';
            if (l.trigger_type.includes('aqi')) apiStatus.aqicn = 'Unstable/Unavailable';
        }
    });

    res.json({
        health: apiStatus,
        recent_triggers: logs.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed fetching trigger log status' });
  }
});

router.get('/fraud-clusters', authenticateToken, async (req, res) => {
    try {
        const [clusters] = await db.query('SELECT * FROM fraud_clusters ORDER BY created_at DESC LIMIT 20');
        res.json(clusters);
    } catch (e) {
        res.status(500).json({ error: 'Failed fetching fraud clusters' });
    }
});

export default router;
