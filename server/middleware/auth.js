import jwt from 'jsonwebtoken';

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Auth token missing', data: null });
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_hackathon_secret_9921';

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token invalid or expired', data: null });
    }
    req.user = user;
    next();
  });
}
