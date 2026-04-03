
import db from './db.js';
import { calculateUserTrustScore, recalculateAllTrustScores } from './services/trustService.js';

async function verify() {
    console.log("--- Starting Trust Score Verification ---");
    
    // 1. Recalculate for all
    await recalculateAllTrustScores();
    
    // 2. Check a few users
    const [users] = await db.query('SELECT id, name, trust_score, created_at FROM users LIMIT 3');
    for (const user of users) {
        console.log(`User: ${user.name} (ID: ${user.id}), New Trust Score: ${user.trust_score}`);
        const [history] = await db.query('SELECT * FROM trust_history WHERE user_id = ? ORDER BY id DESC LIMIT 1', [user.id]);
        if (history.length > 0) {
            console.log(`Factors: ${history[0].factors_json}`);
        }
    }

    // 3. Mock a claim creation for User ID 1 (High Trust: 82 before, check now)
    // We need to find a policy for this user
    const [policies] = await db.query("SELECT * FROM policies WHERE user_id = 1 AND status = 'active' LIMIT 1");
    if (policies.length > 0) {
        const policy = policies[0];
        console.log(`\n--- Verifying Claim Automation for User 1 (Policy ${policy.id}) ---`);
        
        // We'll manually call the logic that was added to triggerMonitor.js
        // Normally this is triggered by cron, but we can simulate the status assignment
        const [userData] = await db.query('SELECT trust_score FROM users WHERE id = 1');
        const trust = userData[0].trust_score;
        let status = 'pending_verification';
        if (trust >= 80) status = 'approved';
        else if (trust <= 30) status = 'manual_review';
        
        console.log(`Trust Score: ${trust} -> Expected Status: ${status}`);
    }

    process.exit(0);
}

verify();
