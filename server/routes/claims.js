import express from 'express';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Get Claims Stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Get all claims mapping to policies owned by this user
    const [claims] = await db.query(
      `SELECT c.* FROM claims c
       JOIN policies p ON c.policy_id = p.id
       WHERE p.user_id = ?`,
      [userId]
    );

    let totalPaid = 0;
    let successCount = 0;
    let hoursProtected = 0;

    claims.forEach(c => {
      hoursProtected += c.disruption_hours || 0;
      if (c.status === 'approved' || c.status === 'payout_success') {
        totalPaid += c.amount || 0;
        successCount++;
      }
    });

    const successRate = claims.length > 0 ? ((successCount / claims.length) * 100).toFixed(0) : 100;

    res.json({
      success: true, 
      message: 'Claim stats loaded',
      data: {
        total_claims: claims.length,
        total_paid: totalPaid,
        hours_protected: hoursProtected,
        success_rate: successRate
      }
    });
  } catch (error) {
    console.error('Fetch Claims Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving claims stats', data: null });
  }
});

// Single Claim Details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [claims] = await db.query(
      `SELECT c.* FROM claims c
       JOIN policies p ON c.policy_id = p.id
       WHERE p.user_id = ? AND c.id = ?`,
      [userId, req.params.id]
    );

    if (claims.length === 0) return res.status(404).json({ success: false, message: 'Claim not found', data: null });
    
    // Fetch payouts attached to claim
    const [payouts] = await db.query('SELECT * FROM payouts WHERE claim_id = ?', [claims[0].id]);
    
    res.json({ success: true, message: 'Claim execution details retrieved', data: { claim: claims[0], payouts } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving claim', data: null });
  }
});

// All Claims
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [claims] = await db.query(
      `SELECT c.*, p.plan_tier 
       FROM claims c
       JOIN policies p ON c.policy_id = p.id
       WHERE p.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json({ success: true, message: 'Historical claims arrays extracted', data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving claims', data: null });
  }
});

export default router;
