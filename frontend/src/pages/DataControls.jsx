import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { Upload, FileUp, CheckCircle, AlertTriangle, Users, FileText, Check, ArrowRight } from 'lucide-react';

export default function DataControls() {
  const [settings, setSettings] = useState(db.getSettings());
  const [retentionDays, setRetentionDays] = useState(settings.candidate_retention_days || 180);
  const [candidates, setCandidates] = useState([]);
  const [parsedRows, setParsedRows] = useState([]);
  const [previewing, setPreviewing] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  useEffect(() => {
    setCandidates(db.getCandidates());
  }, []);

  const handleSaveRetention = () => {
    const updated = db.updateSettings({ candidate_retention_days: Number(retentionDays) }, currentUser?.username || 'admin');
    setSettings(updated);
    alert(`Candidate data retention updated to ${retentionDays} days. Logged to Audit Trail.`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length <= 1) {
        alert('CSV file appears empty or missing data rows.');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 2) {
          const rowObj = {
            name: cols[0] || 'Unknown',
            email: cols[1] || 'no-email@candidate.com',
            role: cols[2] || 'Applicant',
            department: cols[3] || 'Engineering',
            score: Number(cols[4]) || 85
          };
          rows.push(rowObj);
        }
      }

      setParsedRows(rows);
      setPreviewing(true);
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleConfirmImport = () => {
    if (!parsedRows.length) return;
    const updated = db.bulkImportCandidates(parsedRows, currentUser?.username || 'admin');
    setCandidates(updated);
    setImportSuccess(`Successfully imported ${parsedRows.length} candidates with data retention compliance.`);
    setPreviewing(false);
    setParsedRows([]);
    setTimeout(() => setImportSuccess(''), 4000);
  };

  return (
    <Section 
      title="Data Controls & Bulk Ingestion" 
      subtitle="Candidate data retention policies and CSV bulk candidate import with pre-validation."
    >
      {importSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2">
          <CheckCircle size={16} /> {importSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Retention Policy Control */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Candidate Data Retention</h3>
          <p className="text-slate-500 text-sm mb-6">
            Configure automated compliance purging threshold for candidate CVs and applicant records under enterprise privacy guidelines.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Retention Duration (Days)
              </label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={retentionDays} 
                  onChange={e => setRetentionDays(e.target.value)}
                  className="input flex-1"
                  min="30"
                  max="730"
                />
                <button onClick={handleSaveRetention} className="btn-primary">
                  Save Policy
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Current policy: Records older than <strong>{retentionDays} days</strong> are automatically queued for archival.
            </p>
          </div>
        </div>

        {/* CSV Bulk Ingestion */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Bulk Candidate Import</h3>
            <p className="text-slate-500 text-sm mb-6">
              Upload candidate spreadsheets (CSV format: Name, Email, Role, Department, Score) with a pre-flight validation preview.
            </p>
          </div>

          <div>
            <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-orange-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
              <FileUp size={32} className="text-orange-500 mb-2" />
              <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Select CSV to Validate & Preview</span>
              <span className="text-xs text-slate-400 mt-1">.csv spreadsheet files only</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* Preview Step */}
      {previewing && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> Pre-Flight Validation Preview
              </h4>
              <p className="text-xs text-slate-400">Review {parsedRows.length} parsed records before committing to the database.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPreviewing(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300">
                Cancel
              </button>
              <button onClick={handleConfirmImport} className="btn-primary flex items-center gap-2">
                <Check size={16} /> Confirm & Import {parsedRows.length} Candidates
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 max-h-60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/5 text-slate-500">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {parsedRows.map((r, i) => (
                  <tr key={i}>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">{r.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{r.email}</td>
                    <td className="p-3">{r.role}</td>
                    <td className="p-3">{r.department}</td>
                    <td className="p-3 text-emerald-600 font-bold">{r.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Pipeline Pool */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Candidate Talent Pipeline Pool</h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Candidate</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Role Applied</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Department</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Match Score</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Stage</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {candidates.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-bold text-slate-800 dark:text-white">{c.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{c.role}</td>
                  <td className="p-4 text-slate-500 text-xs">{c.department}</td>
                  <td className="p-4 font-bold text-emerald-600">{c.score}%</td>
                  <td className="p-4">
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg font-semibold">
                      {c.stage}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
