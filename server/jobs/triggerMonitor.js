import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import db from '../db.js';
import { recalculateAllTrustScores } from '../services/trustService.js';


const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY || 'dummy_key';
const AQI_KEY = process.env.AQI_KEY || 'dummy_key';

// Payout Simulator
async function processPayout(claim, policy, amount) {
    try {
        await db.query('UPDATE claims SET status = ? WHERE id = ?', ['payout_processing', claim.id]);
        
        // Step 2: Simulate Razorpay payout
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const transaction_id = 'GS' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        await db.query('INSERT INTO payouts (claim_id, amount, method, transaction_id, status) VALUES (?,?,?,?,?)', 
          [claim.id, amount, 'upi', transaction_id, 'success']);
        
        await db.query('UPDATE claims SET status = ? WHERE id = ?', ['payout_success', claim.id]);
        
        await db.query('INSERT INTO notifications (user_id, claim_id, message, type) VALUES (?,?,?,?)',
          [policy.user_id, claim.id, `Payout of Rs.${amount} sent to your UPI. Transaction ID: ${transaction_id}`, 'payout_success']);
        
        console.log(`Payout SUCCESS: Rs.${amount} for claim ${claim.id}, txn ${transaction_id}`);
        return { success: true, transaction_id };
    } catch (error) {
        await db.query('UPDATE claims SET status = ? WHERE id = ?', ['payout_failed', claim.id]);
        console.error(`Payout FAILED for claim ${claim.id}:`, error);
        return { success: false, error };
    }
}

// Fraud Checker
export async function runFraudCheck(policy, trigger_type, zone_id) {
    let fraud_score = 0.1;
    let flags = [];
    
    // Rule 1: Zone match
    const [users] = await db.query('SELECT zone_id, trust_score FROM users WHERE id = ?', [policy.user_id]);
    if (users.length && users[0].zone_id !== zone_id) {
        fraud_score += 0.5;
        flags.push('ZONE_MISMATCH');
    }
    
    // Rule 2: Duplicate claim
    const [duplicates] = await db.query(`
      SELECT id FROM claims 
      WHERE policy_id = ? 
        AND trigger_type = ?
        AND created_at > datetime('now', '-24 hours')`,
      [policy.id, trigger_type]);
    if (duplicates && duplicates.length > 0) {
        fraud_score += 0.6;
        flags.push('DUPLICATE_CLAIM');
    }
    
    // Rule 3: Frequency
    const [recent] = await db.query(`
      SELECT COUNT(*) as count FROM claims
      WHERE policy_id = ?
        AND created_at > datetime('now', '-7 days')
        AND status IN ('approved', 'payout_success')`,
      [policy.id]);
    if (recent && recent[0].count > 3) {
        fraud_score += 0.3;
        flags.push('HIGH_CLAIM_FREQUENCY');
    }
    
    const trust_score = users.length ? users[0].trust_score : 50;

    if (trust_score >= 70) {
        fraud_score = Math.max(0.05, fraud_score - 0.3);
    }
    if (trust_score < 30) {
        fraud_score = Math.min(0.9, fraud_score + 0.2);
    }
    
    fraud_score = Math.min(0.95, Math.max(0.05, fraud_score));
    const consistency_score = Math.round(100 - (fraud_score * 100));
    
    return { fraud_score, flags, consistency_score };
}

export async function createClaimsForZone(zone_id, trigger_type, trigger_value, payout_ratio) {
    await db.query('INSERT INTO triggers_log (zone_id, trigger_type, trigger_value, threshold_crossed) VALUES (?,?,?,1)', 
        [zone_id, trigger_type, trigger_value]);
    
    const [policies] = await db.query(`
      SELECT p.*, u.daily_income, u.working_hours, u.trust_score, u.id as u_id, u.name, u.platform
      FROM policies p
      JOIN users u ON p.user_id = u.id
      WHERE u.zone_id = ? 
        AND p.status = 'active'
        AND p.end_date >= date('now', 'localtime')
        AND p.start_date <= date('now', 'localtime')`, [zone_id]);
    
    const triggerCoverage = {
        rainfall: ['basic', 'standard', 'premium'],
        heat: ['standard', 'premium'],
        pollution: ['standard', 'premium'],
        curfew: ['premium'],
        platform_outage: ['basic', 'standard', 'premium']
    };
    
    for (const policy of policies) {
        if (!triggerCoverage[trigger_type].includes(policy.plan_tier)) continue;
        
        const fraudResult = await runFraudCheck(policy, trigger_type, zone_id);
        
        if (fraudResult.fraud_score > 0.7) {
            await db.query(`INSERT INTO claims (policy_id, trigger_type, trigger_value, amount, status, consistency_score, fraud_risk_score, disruption_hours)
               VALUES (?, ?, ?, ?, 'rejected', ?, ?, ?)`, 
               [policy.id, trigger_type, trigger_value, 0, fraudResult.consistency_score, fraudResult.fraud_score, 0]);
            continue;
        }
        
        const hourly_rate = policy.daily_income / policy.working_hours;
        const disruption_hours = trigger_type === 'platform_outage' ? parseFloat(trigger_value) || 4 : 4;
        let payout = hourly_rate * disruption_hours * payout_ratio;
        
        const caps = {basic: 300, standard: 400, premium: 500};
        payout = Math.min(payout, caps[policy.plan_tier]);
        payout = Math.round(payout);
        
        let status = 'pending_verification';
        if (policy.trust_score >= 80) {
            status = 'approved';
        } else if (policy.trust_score <= 30) {
            status = 'manual_review';
        }

        const [claimResult] = await db.query(`INSERT INTO claims (policy_id, trigger_type, trigger_value, amount, status, consistency_score, fraud_risk_score, disruption_hours)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
           [policy.id, trigger_type, trigger_value, payout, status, fraudResult.consistency_score, fraudResult.fraud_score, disruption_hours]);
        
        const claim = { id: claimResult.insertId };
        
        if (status === 'approved') {
            await processPayout(claim, policy, payout);
        } else {
            const message = status === 'manual_review' 
                ? `Claim of Rs.${payout} flagged for manual review due to low trust score.`
                : `Claim of Rs.${payout} requires manual verification.`;
            await db.query('INSERT INTO notifications (user_id, claim_id, message, type) VALUES (?,?,?,?)',
              [policy.user_id, claim.id, message, 'verification']);
        }

    }
}

// Subordinate 15-minute polling Cron
cron.schedule('*/15 * * * *', async () => {
    console.log('Running 15-minute Trigger Monitor Cron...');
    const [zones] = await db.query('SELECT * FROM zones');

    for (const zone of zones) {
        // Trigger 1 & 2: Rainfall & Heat
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${zone.city},IN&appid=${OPENWEATHER_KEY}&units=metric`;
            const response = await axios.get(weatherUrl);
            const rain = response.data.rain?.['1h'] || 0;
            if (rain > 50) {
                await createClaimsForZone(zone.id, 'rainfall', rain, 1.0);
            }

            const temp = response.data.main?.temp;
            if (temp > 43) {
                await createClaimsForZone(zone.id, 'heat', temp, 0.5);
            }
        } catch (error) {
            console.error('Weather API Unavailable for', zone.city);
            await db.query(`INSERT INTO triggers_log (zone_id, trigger_type, trigger_value, threshold_crossed) VALUES (?,?,?,0)`, [zone.id, 'weather_api_unavailable', 'API_UNAVAILABLE']);
        }

        // Trigger 3: Pollution
        try {
            const aqiUrl = `https://api.waqi.info/feed/${zone.city}/?token=${AQI_KEY}`;
            const aqiResponse = await axios.get(aqiUrl);
            const aqi = aqiResponse.data?.data?.aqi || 0;
            if (aqi > 300) {
                await createClaimsForZone(zone.id, 'pollution', aqi, 0.5);
            }
        } catch (error) {
            console.error('AQI API Unavailable');
            await db.query(`INSERT INTO triggers_log (zone_id, trigger_type, trigger_value, threshold_crossed) VALUES (?,?,?,0)`, [zone.id, 'aqi_api_unavailable', 'API_UNAVAILABLE']);
        }

        // Trigger 4: Curfew Mock
        try {
            const curfewData = JSON.parse(fs.readFileSync(path.join(process.cwd(), '../mock-apis/curfew_feed.json')));
            const cityCurfew = curfewData.find(c => c.city === zone.city || c.city === zone.area_name);
            if (cityCurfew && cityCurfew.active) {
                await createClaimsForZone(zone.id, 'curfew', 1, 1.0);
            }
        } catch (e) {}

        // Trigger 5: Platform Mock
        try {
            const platformData = JSON.parse(fs.readFileSync(path.join(process.cwd(), '../mock-apis/platform_outage.json')));
            const cityPlatform = platformData.find(c => c.city === zone.city || c.city === zone.area_name);
            if (cityPlatform && cityPlatform.down) {
                const outage_hours = (Date.now() - new Date(cityPlatform.started_at).getTime()) / 3600000;
                if (outage_hours > 2) {
                    await createClaimsForZone(zone.id, 'platform_outage', outage_hours, outage_hours / 8);
                }
            }
        } catch (e) {}
    }
});

// Trust Score Logic Sunday 00:00 Recalculation Cron
cron.schedule('0 0 * * 0', async () => {
    console.log('Running Refined Trust Score Recalculator...');
    await recalculateAllTrustScores();
});

