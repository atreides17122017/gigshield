import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

async function initDb() {
  if (db) return;
  db = await open({
    filename: path.join(process.cwd(), 'gigshield.db'),
    driver: sqlite3.Database
  });
}

// Wrapper to make sqlite compatible with mysql2/promise syntax
const pool = {
  query: async (sql, params) => {
    await initDb();
    const isSelect = sql.trim().toLowerCase().startsWith('select') || sql.trim().toLowerCase().startsWith('pragma');
    if (isSelect) {
      const rows = await db.all(sql, params);
      return [rows]; // mimicking [rows, fields]
    } else {
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  },
  execute: async (sql, params) => {
    await initDb();
    const isSelect = sql.trim().toLowerCase().startsWith('select') || sql.trim().toLowerCase().startsWith('pragma');
    if (isSelect) {
      const rows = await db.all(sql, params);
      return [rows];
    } else {
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  }
};

export default pool;
