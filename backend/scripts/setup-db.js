import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { pool } from '../src/db.js';
dotenv.config();
const sql=fs.readFileSync(path.resolve('schema.sql'),'utf8');
const stmts = sql.split(';').map(s=>s.trim()).filter(Boolean);
for (let s of stmts) { 
  await pool.query(s); 
}
await pool.end();
console.log('Database schema ready.');
