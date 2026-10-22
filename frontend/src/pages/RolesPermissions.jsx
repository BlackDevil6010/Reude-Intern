import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { Shield, Check, X, Lock, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  useEffect(() => {
    setRoles(db.getRoles());
    setPermissions(db.getPermissions());
    setMatrix(db.getRolePermissions());
  }, []);

  const handleToggle = (roleName, permId) => {
    if (roleName === 'Admin') {
      alert('Admin has absolute superuser access across all modules.');
      return;
    }
    const currentList = matrix[roleName] || [];
    let updated;
    if (currentList.includes(permId)) {
      updated = currentList.filter(p => p !== permId);
    } else {
      updated = [...currentList, permId];
    }
    const newMatrix = { ...matrix, [roleName]: updated };
    setMatrix(newMatrix);
    db.updateRolePermissions(roleName, updated, currentUser?.username || 'admin');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Group permissions by module
  const grouped = permissions.reduce((acc, p) => {
    const mod = p.module || 'General';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  return (
    <Section 
      title="Roles & Permissions Matrix" 
      subtitle="Define and enforce access rights across Admin, Management, and Employee personas."
      action={
        savedSuccess ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold text-sm">
            <Check size={16} /> Saved to Audit Log
          </div>
        ) : null
      }
    >
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
          <Shield size={16} className="shrink-0" />
          Matrix edits are restricted to Admin. Real-time changes are instantly logged to the tamper-evident Audit Log.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <th className="p-4 font-extrabold uppercase text-xs tracking-wider w-[40%]">Capability / Permission Key</th>
                {roles.map(r => (
                  <th key={r.id} className="p-4 font-extrabold uppercase text-xs tracking-wider text-center">
                    <span className={`px-3 py-1 rounded-full ${
                      r.name === 'Admin' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400' :
                      r.name === 'Management' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}>
                      {r.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {Object.entries(grouped).map(([mod, perms]) => (
                <React.Fragment key={mod}>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                    <td colSpan={roles.length + 1} className="p-3 font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Module: {mod}
                    </td>
                  </tr>
                  {perms.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-white">{p.label}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{p.id}</div>
                      </td>
                      {roles.map(r => {
                        const hasPerm = r.name === 'Admin' || (matrix[r.name] || []).includes(p.id);
                        const isLocked = r.name === 'Admin';
                        return (
                          <td key={r.id} className="p-4 text-center">
                            <button
                              disabled={isLocked}
                              onClick={() => handleToggle(r.name, p.id)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all ${
                                hasPerm
                                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                              } ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110'}`}
                            >
                              {hasPerm ? <Check size={18} /> : <X size={16} />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
