import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { exportToCSV, printToPDF } from '../utils/exportUtils';
import { Download, Printer, Filter, BarChart3, FileSpreadsheet, Calendar, Users, Briefcase } from 'lucide-react';

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [interns, setInterns] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [reportType, setReportType] = useState('workforce');
  const [deptFilter, setDeptFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  useEffect(() => {
    setEmployees(db.getEmployees());
    setInterns(db.getInterns());
    setLeaves(db.getLeaves());
  }, []);

  const deptList = ['All', ...new Set([...employees.map(e => e.department).filter(Boolean), ...interns.map(i => i.department).filter(Boolean)])];

  // Prepared data
  const workforceRows = [
    ...employees.map(e => ({
      Type: 'Employee',
      ID: e.employee_id,
      Name: `${e.first_name} ${e.last_name}`.trim(),
      Department: e.department,
      Designation: e.designation,
      Email: e.work_email,
      Status: e.employment_status,
      JoiningDate: e.joining_date
    })),
    ...interns.map(i => ({
      Type: 'Intern',
      ID: i.intern_id,
      Name: i.name,
      Department: i.department,
      Designation: 'Intern',
      Email: i.email,
      Status: i.status,
      JoiningDate: i.start_date
    }))
  ].filter(r => {
    const matchDept = deptFilter === 'All' || r.Department === deptFilter;
    const matchRole = roleFilter === 'All' || r.Type === roleFilter;
    return matchDept && matchRole;
  });

  const handleExportCSV = () => {
    const filename = `reude_${reportType}_report_${new Date().toISOString().slice(0, 10)}`;
    exportToCSV(filename, workforceRows);
    db.logAudit(currentUser?.username || 'user', 'REPORT_CSV_EXPORT', 'Report', reportType, '', `${workforceRows.length} rows exported`);
  };

  const handleExportPDF = () => {
    const htmlRows = workforceRows.map(r => `
      <tr>
        <td><strong>${r.ID}</strong></td>
        <td>${r.Name}</td>
        <td>${r.Type}</td>
        <td>${r.Department}</td>
        <td>${r.Designation}</td>
        <td>${r.Status}</td>
        <td>${r.JoiningDate}</td>
      </tr>
    `).join('');

    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Joining Date</th>
          </tr>
        </thead>
        <tbody>
          ${htmlRows}
        </tbody>
      </table>
    `;

    printToPDF(`REUDE Workforce & Department Intelligence Report`, tableHtml);
    db.logAudit(currentUser?.username || 'user', 'REPORT_PDF_EXPORT', 'Report', reportType, '', `${workforceRows.length} rows printed`);
  };

  return (
    <Section 
      title="Enterprise Reports & Export Hub" 
      subtitle="Filter workforce data by role and department with audit-logged CSV and PDF generation."
      action={
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="btn-primary flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm flex items-center gap-2 shadow-sm">
            <Printer size={16} /> Print / PDF
          </button>
        </div>
      }
    >
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Report Subject</label>
            <select 
              value={reportType} 
              onChange={e => setReportType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-reude text-slate-800 dark:text-white"
            >
              <option value="workforce">Workforce & Headcount</option>
              <option value="interns">Internship Performance</option>
              <option value="leaves">Leave & Absence Records</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
            <select 
              value={deptFilter} 
              onChange={e => setDeptFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-reude text-slate-800 dark:text-white"
            >
              {deptList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category / Role</label>
            <select 
              value={roleFilter} 
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-reude text-slate-800 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="Employee">Full-time Employees</option>
              <option value="Intern">Interns</option>
            </select>
          </div>
        </div>

        {/* Results Preview */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Matching Records: {workforceRows.length}
          </span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            All export actions logged to Audit Trail
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Type</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Department</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Designation</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Joining Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {workforceRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-xs text-orange-500">{r.ID}</td>
                  <td className="p-4 font-extrabold text-slate-800 dark:text-white">{r.Name}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      r.Type === 'Employee' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                    }`}>
                      {r.Type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{r.Department}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{r.Designation}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      {r.Status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">{r.JoiningDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
