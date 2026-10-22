import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { exportToCSV } from '../utils/exportUtils';
import { ShieldAlert, Download, Search, Calendar, User, Filter, RefreshCw } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [actorFilter, setActorFilter] = useState('All');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  useEffect(() => {
    setLogs(db.getAuditLogs());
  }, []);

  const handleExport = () => {
    exportToCSV(`reude_audit_log_${new Date().toISOString().slice(0, 10)}`, logs);
    db.logAudit(currentUser?.username || 'admin', 'AUDIT_LOG_EXPORT', 'AuditLogs', 'all', '', 'CSV Exported');
    setLogs(db.getAuditLogs());
  };

  const actionList = ['All', ...new Set(logs.map(l => l.action))];
  const actorList = ['All', ...new Set(logs.map(l => l.actor))];

  const filtered = logs.filter(l => {
    const matchSearch = 
      (l.action && l.action.toLowerCase().includes(search.toLowerCase())) ||
      (l.entity && l.entity.toLowerCase().includes(search.toLowerCase())) ||
      (l.actor && l.actor.toLowerCase().includes(search.toLowerCase())) ||
      (l.old_value && l.old_value.toLowerCase().includes(search.toLowerCase())) ||
      (l.new_value && l.new_value.toLowerCase().includes(search.toLowerCase()));
    const matchAction = actionFilter === 'All' || l.action === actionFilter;
    const matchActor = actorFilter === 'All' || l.actor === actorFilter;
    return matchSearch && matchAction && matchActor;
  });

  return (
    <Section 
      title="System Audit Trail" 
      subtitle="Immutable, append-only log of role alterations, approvals, data exports, and user activity."
      action={
        <button onClick={handleExport} className="btn-primary flex items-center gap-2">
          <Download size={18} /> Export Audit Log (CSV)
        </button>
      }
    >
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search logs by keyword..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pl-11 text-sm focus:outline-none focus:border-reude text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <select 
              value={actionFilter} 
              onChange={e => setActionFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-reude text-slate-800 dark:text-white font-medium"
            >
              <option value="All">Filter by Action (All)</option>
              {actionList.filter(a => a !== 'All').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <select 
              value={actorFilter} 
              onChange={e => setActorFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-reude text-slate-800 dark:text-white font-medium"
            >
              <option value="All">Filter by Actor (All)</option>
              {actorList.filter(a => a !== 'All').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Timestamp</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Actor</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Action</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Target Entity</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Details / Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500"/> {l.actor}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    {l.entity} {l.entity_id ? `(#${l.entity_id})` : ''}
                  </td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {l.old_value && l.new_value ? (
                      <span><span className="line-through text-rose-500">{l.old_value}</span> → <span className="text-emerald-500 font-bold">{l.new_value}</span></span>
                    ) : (
                      l.new_value || l.old_value || '—'
                    )}
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
