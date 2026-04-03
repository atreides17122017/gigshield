
import db from '../db.js';

/**
 * Recalculates the trust score for a specific user based on:
 * - Tenure (registration duration)
 * - Claim frequency vs zone average
 * - Activity data (profile consistency)
 * - Payment history (renewals)
 */
export async function calculateUserTrustScore(userId) {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!users || users.length === 0) return null;
        const user = users[0];

        // 1. Tenure Score (Max 25)
        const daysSinceJoined = Math.floor((Date.now() - new Date(user.created_at)) / 86400000);
        let tenureScore = 5;
        if (daysSinceJoined >= 365) tenureScore = 25;
        else if (daysSinceJoined >= 180) tenureScore = 20;
        else if (daysSinceJoined >= 90) tenureScore = 15;
        else if (daysSinceJoined >= 30) tenureScore = 10;

        // 2. Claim Frequency Score (Max 30)
        // Get user claims in last 30 days
        const [userClaims] = await db.query(`
            SELECT COUNT(*) as count FROM claims c
            JOIN policies p ON c.policy_id = p.id
            WHERE p.user_id = ? AND c.created_at > date('now', '-30 days')
        `, [userId]);
        const userClaimCount = userClaims[0].count;

        // Get zone average claims per user in last 30 days
        const [zoneAvgData] = await db.query(`
            SELECT AVG(cnt) as avg_count FROM (
                SELECT COUNT(*) as cnt FROM claims c
                JOIN policies p ON c.policy_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE u.zone_id = ? AND c.created_at > date('now', '-30 days')
                GROUP BY u.id
            )
        `, [user.zone_id]);
        const avgZoneCount = (zoneAvgData[0] && zoneAvgData[0].avg_count) || 0.5; // Default low threshold

        let claimScore = 30;
        if (userClaimCount > avgZoneCount) {
            claimScore = Math.round(30 * (avgZoneCount / userClaimCount));
        }

        // 3. Activity Match Score (Max 25)
        // Simulation: Profile consistency as proxy for activity
        const activityScore = (user.working_hours > 0 && user.daily_income > 0) ? 25 : 5;

        // 4. Payment History Score (Max 20)
        const [policyCount] = await db.query('SELECT COUNT(*) as count FROM policies WHERE user_id = ?', [userId]);
        let paymentScore = 10;
        if (policyCount[0].count > 1) paymentScore = 20; // Renewal detected

        // Total Score
        const totalScore = tenureScore + claimScore + activityScore + paymentScore;
        const refinedScore = Math.min(100, Math.max(0, totalScore));

        // Update User
        await db.query('UPDATE users SET trust_score = ?, tenure_days = ? WHERE id = ?', 
            [refinedScore, daysSinceJoined, userId]);

        // Log to history
        const factors = {
            tenure: tenureScore,
            claims: claimScore,
            activity: activityScore,
            payment: paymentScore,
            zone_avg: avgZoneCount,
            user_count: userClaimCount
        };

        await db.query("INSERT INTO trust_history (user_id, score, recalc_date, factors_json) VALUES (?, date('now'), ?, ?)",
            [userId, refinedScore, JSON.stringify(factors)]);

        return { score: refinedScore, factors };
    } catch (error) {
        console.error('Error calculating trust score for user', userId, error);
        return null;
    }
}

/**
 * Mass recalculation for all users
 */
export async function recalculateAllTrustScores() {
    const [users] = await db.query('SELECT id FROM users');
    console.log(`Recalculating trust scores for ${users.length} users...`);
    for (const user of users) {
        await calculateUserTrustScore(user.id);
    }
}
