import { query } from './src/db.js';
query('SELECT u.*,e.first_name,e.last_name,e.department,e.designation FROM users u LEFT JOIN employees e ON e.user_id=u.id WHERE u.username=? OR e.work_email=? LIMIT 1',['admin','admin']).then(res => { console.log(res); process.exit(0); });
