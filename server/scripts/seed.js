import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

async function seed() {
  const db = await open({
    filename: path.join(process.cwd(), 'gigshield.db'),
    driver: sqlite3.Database
  });

  console.log('Connected to SQLite. Creating tables...');

  // Zones Table (Added zone_density)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city VARCHAR(50),
      area_name VARCHAR(100),
      risk_score FLOAT,
      zone_density VARCHAR(20) DEFAULT 'urban',
      lat FLOAT,
      lng FLOAT,
      flood_history_score FLOAT,
      heat_history_score FLOAT,
      aqi_history_score FLOAT
    )
  `);

  // Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      name VARCHAR(100),
      zone_id INT,
      platform VARCHAR(50),
      daily_income DECIMAL(10,2),
      working_hours INT,
      trust_score INT DEFAULT 50,
      tenure_days INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (zone_id) REFERENCES zones(id)
    )
  `);

  // Policies Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INT,
      plan_tier VARCHAR(50),
      weekly_premium DECIMAL(10,2),
      start_date DATE,
      end_date DATE,
      status VARCHAR(20),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Claims Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      policy_id INT,
      trigger_type VARCHAR(50),
      trigger_value VARCHAR(50),
      status VARCHAR(50),
      amount DECIMAL(10,2),
      consistency_score INT,
      fraud_risk_score FLOAT,
      disruption_hours FLOAT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (policy_id) REFERENCES policies(id)
    )
  `);

  // Payouts Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS payouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      claim_id INT,
      amount DECIMAL(10,2),
      method VARCHAR(50),
      transaction_id VARCHAR(100),
      status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (claim_id) REFERENCES claims(id)
    )
  `);

  // Notifications Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INT,
      claim_id INT,
      message TEXT,
      type VARCHAR(50),
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Triggers Log
  await db.exec(`
    CREATE TABLE IF NOT EXISTS triggers_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zone_id INT,
      trigger_type VARCHAR(50),
      trigger_value VARCHAR(50),
      threshold_crossed BOOLEAN,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (zone_id) REFERENCES zones(id)
    )
  `);

  // Trust History
  await db.exec(`
    CREATE TABLE IF NOT EXISTS trust_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INT,
      score INT,
      recalc_date DATE,
      factors_json TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Fraud Clusters
  await db.exec(`
    CREATE TABLE IF NOT EXISTS fraud_clusters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trigger_id INT,
      cluster_id INT,
      member_count INT,
      avg_trust_score FLOAT,
      action_taken VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Drop existing data
  await db.exec('DELETE FROM notifications');
  await db.exec('DELETE FROM payouts');
  await db.exec('DELETE FROM claims');
  await db.exec('DELETE FROM policies');
  await db.exec('DELETE FROM users');
  await db.exec('DELETE FROM zones'); 

  console.log('Inserting seed data into zones...');

  const insertZones = `
    INSERT INTO zones (id, city, area_name, risk_score, flood_history_score, heat_history_score, aqi_history_score, zone_density) VALUES
    (1, 'Delhi', 'South Delhi', 0.7, 0.6, 0.9, 0.95, 'urban'),
    (2, 'Mumbai', 'Andheri Mumbai', 0.85, 0.9, 0.3, 0.5, 'urban'),
    (3, 'Chennai', 'Velachery Chennai', 0.8, 0.85, 0.8, 0.4, 'urban'),
    (4, 'Bengaluru', 'Koramangala Bengaluru', 0.3, 0.2, 0.3, 0.3, 'urban')
  `;
  await db.exec(insertZones);

  console.log('Inserting demo user...');
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('demo123', salt);

  await db.run(`
    INSERT INTO users (id, email, password_hash, name, platform, zone_id, daily_income, working_hours, trust_score, tenure_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [1, 'demo@gigshield.com', passwordHash, 'Ravi Kumar', 'Zomato', 1, 700, 10, 82, 1095]);

  console.log('Inserting demo policy...');
  await db.run(`
    INSERT INTO policies (id, user_id, plan_tier, weekly_premium, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [1, 1, 'premium', 61.00, '2026-03-21', '2026-04-04', 'active']);

  console.log('Inserting demo claims...');
  await db.run(`
    INSERT INTO claims (id, policy_id, trigger_type, trigger_value, amount, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [1, 1, 'rainfall', '65mm', 420.00, 'approved', '2026-03-15 14:00:00']);

  await db.run(`
    INSERT INTO claims (id, policy_id, trigger_type, trigger_value, amount, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [2, 1, 'platform_outage', '2hrs', 175.00, 'approved', '2026-03-28 16:30:00']);

  console.log('Database seeded successfully!');
  await db.close();
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
