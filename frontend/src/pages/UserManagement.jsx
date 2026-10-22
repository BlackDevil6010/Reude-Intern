import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { Users, Mail, UserPlus, KeyRound, Shield, Search, ArrowUpDown, Power, Check, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [inviting, setInviting] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', display: '', role: 'Employee' });
  const [notice, setNotice] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  useEffect(() => {
    setUsers(db.getUsers());
    setRoles(db.getRoles());
  }, []);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newUser.email) return;
    const updated = db.inviteUser(newUser, currentUser?.username || 'admin');
    setUsers(updated);
    setInviting(false);
    setNewUser({ email: '', display: '', role: 'Employee' });
    setNotice(`Invitation and activation link issued to ${newUser.email}`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleToggleStatus = (userId) => {
    if (userId === 'admin') {
      alert('Default Admin account cannot be deactivated.');
      return;
    }
    const updated = db.toggleUserStatus(userId, currentUser?.username || 'admin');
    setUsers(updated);
  };

  const handleRoleChange = (userId, newRole) => {
    if (userId === 'admin') {
      alert('Admin user role cannot be modified.');
      return;
    }
    const updated = db.updateUserRole(userId, newRole, currentUser?.username || 'admin');
    setUsers(updated);
    setNotice(`Role updated successfully for user.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleResetPassword = (userId) => {
    db.resetUserPassword(userId, currentUser?.username || 'admin');
    alert(`Temporary password reset token generated and logged for user.`);
  };

  const filtered = users.filter(u => {
    const matchSearch = 
      (u.display && u.display.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <Section 
      title="User Management & Provisioning" 
      subtitle="Invite users by email, manage roles, toggle activation, and audit logins."
      action={
        <button 
          onClick={() => setInviting(true)} 
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} /> Invite User
        </button>
      }
    >
      {notice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2">
          <Check size={16} /> {notice}
        </div>
      )}

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search user, email, username..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pl-11 text-sm focus:outline-none focus:border-reude text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {['All', 'Admin', 'Management', 'Employee'].map(r => (
              <button 
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === r 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Assigned Role</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Last Login</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 to-reude text-white font-black flex items-center justify-center text-sm shadow-sm">
                        {(u.display || u.username)[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-800 dark:text-white">{u.display || u.username}</div>
                        <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    {u.email || `${u.username.toLowerCase()}@reude.tech`}
                  </td>
                  <td className="p-4">
                    <select 
                      disabled={u.id === 'admin'}
                      value={u.role} 
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Management">Management</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {u.last_login || 'Never'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        title="Force Password Reset"
                        onClick={() => handleResetPassword(u.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <KeyRound size={16} />
                      </button>
                      <button 
                        disabled={u.id === 'admin'}
                        title={u.status === 'Active' ? 'Deactivate User (Soft Delete)' : 'Reactivate User'}
                        onClick={() => handleToggleStatus(u.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          u.status === 'Active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                        }`}
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setInviting(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setInviting(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Invite New User</h2>
              <p className="text-slate-500 text-sm mb-6">Send an onboarding invite and assign their initial access role.</p>

              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input required value={newUser.display} onChange={e => setNewUser({...newUser, display: e.target.value})} className="input" placeholder="e.g. Meera Sharma" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email Address</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="input" placeholder="e.g. meera.sharma@reude.tech" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">System Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="input">
                    <option value="Employee">Employee (Self-Service)</option>
                    <option value="Management">Management (Executive Oversight)</option>
                    <option value="Admin">Admin (Full Control)</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3.5 mt-4">
                  Send Invitation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
