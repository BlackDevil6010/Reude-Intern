import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db;
async function getDb() {
  if (!db) {
    db = await open({
      filename: path.resolve('reude_erp.db'),
      driver: sqlite3.Database
    });
    await db.exec('PRAGMA foreign_keys = ON;');
  }
  return db;
}

export const pool = {
  getConnection: async () => {
    const d = await getDb();
    return {
      execute: async (sql, params = []) => {
        const res = await query(sql, params);
        return [res, []];
      },
      beginTransaction: async () => await d.exec('BEGIN TRANSACTION'),
      commit: async () => await d.exec('COMMIT'),
      rollback: async () => await d.exec('ROLLBACK'),
      release: () => {}
    };
  },
  query: async (sql, params = []) => {
    const res = await query(sql, params);
    return [res, []];
  },
  execute: async (sql, params = []) => {
    const res = await query(sql, params);
    return [res, []];
  },
  end: async () => {
    if (db) await db.close();
  }
};

export async function query(sql, params = []) {
  const d = await getDb();
  const upperSql = sql.trim().toUpperCase();
  if (upperSql.startsWith('SELECT') || upperSql.startsWith('PRAGMA')) {
    return await d.all(sql, params);
  } else {
    const result = await d.run(sql, params);
    return { insertId: result.lastID, affectedRows: result.changes };
  }
}
