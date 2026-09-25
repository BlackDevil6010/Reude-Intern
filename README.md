# REUDE TECHNOLOGIES — Employee ERP

Full-stack employee management + internal communication ERP starter built to the requested architecture:

- React + Vite + Tailwind CSS
- Node.js + Express
- MySQL
- JWT authentication + bcrypt
- Socket.IO real-time messaging
- Excel import with preview/error reporting
- Role-based authorization
- Admin, HR, Manager, Team Lead, Employee and Intern flows
- Dedicated Intern category/dashboard
- Attendance, leave, tasks, announcements, notifications, reports and audit logging

## Source data
The supplied workbook is included at `seed/employee-details.xlsx`. Only populated employee rows are imported; blank spreadsheet cells remain null. The supplied logo is used unchanged at `frontend/public/reude-logo.png`.

## Quick start

### 1. Database
Create a MySQL database and run:

```sql
CREATE DATABASE reude_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run db:setup
npm run seed
npm run dev
```

On macOS/Linux use `cp .env.example .env`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment
Backend `.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reude_erp
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=8h
```

## Initial admin
`npm run seed` creates an admin account from environment variables if present, otherwise:

- username: `admin`
- password: `ChangeMe!2026`

Change it immediately in production.

## Production

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Set `CLIENT_URL`, secure cookies/token strategy for your deployment, HTTPS, a strong JWT secret, rate limiting and a production MySQL account before deployment.
