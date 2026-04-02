import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory cache for demo purposes
// In production, use Redis
const premiumCache = new Map();

export function getPersonalisedPremium(user, zone, planTier) {
    const basePremiums = { basic: 49, standard: 69, premium: 99 };
    const now = new Date();
    const month = now.getMonth();
    // Monsoon: June(5) to September(8)
    const seasonalIndex = (month >= 5 && month <= 8) ? 1.15 :
                          (month >= 3 && month <= 4) ? 1.05 : 0.9;
    
    const input = {
        zone_risk_score: zone.risk_score,
        seasonal_index: seasonalIndex,
        trust_score: user.trust_score,
        claim_history_count: user.claim_count || 0,
        weekly_activity_hours: user.working_hours * 6,
        base_premium: basePremiums[planTier]
    };
    
    return new Promise((resolve) => {
        // Using python command; depending on OS could be python3
        const pythonProcess = spawn('python', [path.join(process.cwd(), '../ml/predict_premium.py')]);
        
        pythonProcess.stdin.write(JSON.stringify(input));
        pythonProcess.stdin.end();
        
        let output = '';
        pythonProcess.stdout.on('data', (data) => output += data);
        
        pythonProcess.on('close', () => {
            try {
                resolve(JSON.parse(output));
            } catch(e) {
                // Fallback if Python fails or isn't installed properly locally
                resolve({
                    personalised_premium: basePremiums[planTier],
                    adjustment_reason: "Standard rate",
                    risk_level: "medium"
                });
            }
        });
    });
}

router.get('/calculate', async (req, res) => {
    try {
        const userId = req.query.userId;
        let cachedOrLocalUser = { trust_score: 50, working_hours: 8, claim_count: 0 };
        let zoneFallback = { risk_score: 0.5 };

        if (userId) {
          const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
          if (users && users.length > 0) {
            cachedOrLocalUser = users[0];
            const [zones] = await db.query('SELECT * FROM zones WHERE id = ?', [users[0].zone_id]);
            zoneFallback = zones && zones.length > 0 ? zones[0] : zoneFallback;
            const [claims] = await db.query(`SELECT COUNT(*) as count FROM claims c JOIN policies p ON c.policy_id = p.id WHERE p.user_id = ?`, [userId]);
            cachedOrLocalUser.claim_count = claims ? claims[0].count : 0;
          }
        }

        const basic = await getPersonalisedPremium(cachedOrLocalUser, zoneFallback, 'basic');
        const standard = await getPersonalisedPremium(cachedOrLocalUser, zoneFallback, 'standard');
        const premium = await getPersonalisedPremium(cachedOrLocalUser, zoneFallback, 'premium');

        const result = { basic, standard, premium };

        res.json({ success: true, message: 'Premium schedules loaded', data: result });
    } catch (err) {
        console.error('Premium logic error:', err);
        // Clean fallback
        res.json({ 
          success: true, 
          message: 'Error computing exact prices. Falling back to basics', 
          data: { 
            basic: { personalised_premium: 49 }, 
            standard: { personalised_premium: 69 }, 
            premium: { personalised_premium: 99 } 
          } 
        });
    }
});

export default router;
