import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import local cron system
import './jobs/triggerMonitor.js';

// Import core route endpoints
import authRoutes from './routes/auth.js';
import policyRoutes from './routes/policy.js';
import premiumRoutes from './routes/premium.js';
import claimRoutes from './routes/claims.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';
import triggerRoutes from './routes/triggers.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-app.vercel.app"
  ]
}));
app.use(express.json());

// API Fallback entry route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Insurix Complete Backend Is Running!' });
});

// Master routes linking
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`Insurix Phase 2 Master Node Server running firmly on http://localhost:${PORT}`);
});
