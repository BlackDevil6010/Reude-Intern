import React, { useRef } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { Download, Upload, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const fileInputRef = useRef(null);

  const downloadBackup = () => {
    const dataStr = db.exportData();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `reude_erp_backup_\${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target.result;
      if (db.importData(json)) {
        alert('Data imported successfully! The application will now reload to apply changes.');
        window.location.reload();
      } else {
        alert('Invalid backup file. Please ensure it is a valid JSON file exported from this system.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Section title="Settings" subtitle="System configuration, security, and workspace backups.">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none">
          <h3 className="font-bold text-lg mb-5 text-slate-800 dark:text-white">Workspace Data Management</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Because this application runs completely in the browser for high performance, data is stored locally. Use these tools to backup your data or move it to another device.
          </p>
          <div className="flex gap-4">
            <button onClick={downloadBackup} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-3 rounded-xl font-bold transition-colors">
              <Download size={18} /> Download Backup
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 px-4 py-3 rounded-xl font-bold transition-colors border border-slate-200 dark:border-white/5">
              <Upload size={18} /> Restore Backup
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          </div>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none mb-6">
        <h3 className="font-bold text-lg mb-5 text-slate-800 dark:text-white">Profile & Security</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Manage your personal details and account security settings.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-reude text-slate-800 dark:text-white" defaultValue="Deepak Raj" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
            <input type="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-reude text-slate-800 dark:text-white" defaultValue="deepak@reude.tech" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Change Password</label>
          <div className="flex gap-4">
            <input type="password" placeholder="New Password" className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-reude text-slate-800 dark:text-white" />
            <button className="bg-gradient-to-r from-orange-500 to-reude text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5">Update</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {['Company Information', 'User Management', 'Roles & Permissions', 'Departments', 'Audit Logs'].map(x => (
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-5 rounded-2xl flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer" key={x}>
            <span className="font-medium text-slate-700 dark:text-slate-200">{x}</span>
            <ChevronRight size={18} className="text-slate-300"/>
          </div>
        ))}
      </div>
    </Section>
  );
}
