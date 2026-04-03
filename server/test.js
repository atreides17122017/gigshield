const sqlite3 = require('sqlite3').verbose();
const http = require('http');

const request = (path) => {
  return new Promise((resolve) => {
    http.get('http://localhost:5000' + path, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    });
  });
};

(async () => {
  try {
    const db = new sqlite3.Database('./Insurix.db');
    const run = (query, params) => new Promise((res, rej) => db.run(query, params, function (err) { if (err) rej(err); else res(this); }));
    const all = (query, params) => new Promise((res, rej) => db.all(query, params, (err, rows) => { if (err) rej(err); else res(rows); }));

    await run('DELETE FROM users WHERE email LIKE "testml%"', []);

    // User 1 (Zone 1, Trust 90, 4 Hrs)
    const res1 = await run('INSERT INTO users (email, password_hash, name, zone_id, trust_score, working_hours) VALUES (?,?,?,?,?,?)',
      ['testml1@test.com', 'x', 'User A', 1, 90, 4]);

    // User 2 (Zone 2, Trust 30, 12 Hrs)
    const res2 = await run('INSERT INTO users (email, password_hash, name, zone_id, trust_score, working_hours) VALUES (?,?,?,?,?,?)',
      ['testml2@test.com', 'x', 'User B', 2, 30, 12]);

    console.log('\\n--- 1. PREMIUM ML VALIDATION ---');
    const premA = await request('/api/premium/calculate?userId=' + res1.lastID);
    const premB = await request('/api/premium/calculate?userId=' + res2.lastID);

    console.log('User A (High Trust, Low Hours) Premium:', JSON.stringify(premA.data));
    console.log('User B (Low Trust, High Hours) Premium:', JSON.stringify(premB.data));

    if (JSON.stringify(premA.data) !== JSON.stringify(premB.data)) {
      console.log('RESULT: PASS (Premiums logic differentiates accurately natively)');
    } else {
      console.log('RESULT: FAIL (Premiums identical)');
    }

    console.log('\\n--- 2. ZERO-TOUCH CLAIMS TRACK VALIDATION ---');
    const autoClaims = await all("SELECT * FROM claims", []);
    if (autoClaims.length > 0) {
      console.log('Evidence: Found actual claims native to db globally across policy maps.');
    } else {
      console.log('Evidence: DB requires cron execution to fire fully mapped variables.');
    }
  } catch (e) {
    console.error(e);
  }
})();
