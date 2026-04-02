import express from 'express';
import db from '../db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [notifs] = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: 'Failed retrieving notifications' });
  }
});

router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error marking logic as read' });
  }
});

export default router;
