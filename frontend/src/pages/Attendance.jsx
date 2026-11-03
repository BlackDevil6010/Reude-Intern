import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { exportToCSV } from '../utils/exportUtils';
import { 
  Clock, Play, Square, Calendar, CheckCircle2, AlertCircle, 
  Download, Users, Timer, Activity, ShieldCheck, Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const role = currentUser?.role || 'Employee';
  const isAdminOrMgmt = role === 'Admin' || role === 'Management';

  // Find matching employee record
  const currentEmp = employees.find(e => 
    String(e.id) === String(currentUser?.id) || 
    String(e.user_id) === String(currentUser?.id) ||
    e.first_name.toLowerCase() === (currentUser?.username || '').toLowerCase()
  ) || employees[0];

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = () => {
    setEmployees(db.getEmployees());
    setAttendance(db.getAttendance());
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const myTodayRecord = attendance.find(a => 
    (String(a.user_id) === String(currentEmp?.id) || String(a.user_id) === String(currentEmp?.user_id) || a.employee_name === `${currentEmp?.first_name} ${currentEmp?.last_name}`) &&
    a.date === todayStr
  );

  const isClockedIn = !!myTodayRecord?.punch_in && !myTodayRecord?.punch_out;

  const handlePunchIn = () => {
    const empName = `${currentEmp?.first_name || 'Staff'} ${currentEmp?.last_name || ''}`.trim();
    db.punchIn(currentEmp?.id || '1', empName, currentEmp?.work_shift || 'Day shift (9am-6pm)');
    loadData();
  };

  const handlePunchOut = () => {
    db.punchOut(currentEmp?.id || '1');
    loadData();
  };

  const handleExportCSV = () => {
    const rows = attendance.map(a => ({
      Date: a.date,
      Employee: a.employee_name,
      Shift: a.shift,
      PunchIn: a.punch_in || '—',
      PunchOut: a.punch_out || '—',
      TotalHours: a.total_hours || '—',
      Status: a.status
    }));
    exportToCSV(`reude_attendance_log_${todayStr}`, rows);
    db.logAudit(currentUser?.username || 'user', 'ATTENDANCE_EXPORT', 'Attendance', 'all', '', `${rows.length} rows exported`);
  };

  return (
    <Section 
      title="Attendance & Real-Time Presence" 
      subtitle="Shift clock-in, break tracking, and department-wide active workforce presence board."
      action={
        <button onClick={handleExportCSV} className="btn-primary flex items-center gap-2 text-xs">
          <Download size={14} /> Export Logs (CSV)
        </button>
      }
    >
      {/* 1. Live Digital Punch Clock Card (Self-Service) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-orange-400 tracking-wider uppercase flex items-center gap-1.5">
                <Timer size={14} /> Shift Punch Clock
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                isClockedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {isClockedIn ? '● Clocked In' : '○ Not Clocked In'}
              </span>
            </div>

            <div className="text-4xl font-black tracking-tight font-mono mb-1 text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-xs text-slate-400 mb-6 font-medium">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Shift:</span>
                <span className="font-bold text-slate-200">{currentEmp?.work_shift || 'Day shift (9am-6pm)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-bold text-slate-200">{currentEmp?.work_location || 'SEC, Chennai Hub'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Today's Punch-In:</span>
                <span className="font-bold text-emerald-400">{myTodayRecord?.punch_in || 'Not punched yet'}</span>
              </div>
              {myTodayRecord?.punch_out && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Today's Punch-Out:</span>
                  <span className="font-bold text-orange-400">{myTodayRecord.punch_out}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {!isClockedIn ? (
              <button 
                onClick={handlePunchIn}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all"
              >
                <Play size={16} fill="white" /> Punch In (Start Shift)
              </button>
            ) : (
              <button 
                onClick={handlePunchOut}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all"
              >
                <Square size={16} fill="white" /> Punch Out (End Shift)
              </button>
            )}
          </div>
        </div>

        {/* 2. Department Live Presence Board */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-emerald-500" /> Active Department Presence
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Live roster of staff clocked in today across facilities</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold rounded-full">
                Real-Time Sync Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map(emp => {
                const empAtt = attendance.find(a => 
                  (String(a.user_id) === String(emp.id) || a.employee_name.includes(emp.first_name)) && 
                  a.date === todayStr
                );
                const active = !!empAtt?.punch_in && !empAtt?.punch_out;

                return (
                  <div key={emp.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 to-reude text-white font-black flex items-center justify-center text-sm shadow-sm relative">
                        {emp.first_name[0]}
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                          active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-800 dark:text-white text-sm">{emp.first_name} {emp.last_name}</div>
                        <div className="text-[11px] text-slate-400">{emp.designation} · {emp.department}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        active 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {active ? `Clocked In (${empAtt.punch_in})` : (empAtt?.punch_out ? 'Shift Done' : 'Away / Off')}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">{emp.work_shift || '9am - 6pm'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Chennai Avionics R&D Facility</span>
            <span className="flex items-center gap-2 text-emerald-600 font-bold">
              <ShieldCheck size={14} /> Biometric & Web Clocking Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Attendance Log Table */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Attendance & Punch Log History</h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Employee</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Shift</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Punch In</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Punch Out</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Duration</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {attendance.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{a.date}</td>
                  <td className="p-4 font-extrabold text-slate-800 dark:text-white">{a.employee_name}</td>
                  <td className="p-4 text-xs text-slate-500">{a.shift}</td>
                  <td className="p-4 text-xs font-mono font-bold text-emerald-600">{a.punch_in || '—'}</td>
                  <td className="p-4 text-xs font-mono font-bold text-orange-500">{a.punch_out || '—'}</td>
                  <td className="p-4 text-xs font-semibold">{a.total_hours}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
