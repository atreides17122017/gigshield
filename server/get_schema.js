
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function getSchema() {
  const db = await open({
    filename: path.join(process.cwd(), 'gigshield.db'),
    driver: sqlite3.Database
  });

  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  for (const table of tables) {
    console.log(`--- Table: ${table.name} ---`);
    const schema = await db.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${table.name}'`);
    console.log(schema.sql);
  }
  await db.close();
}

getSchema();
