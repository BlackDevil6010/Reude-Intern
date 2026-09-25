import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Edit, Trash2, X, Save, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/Section';

export default function Interns() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newIntern, setNewIntern] = useState({ name: '', department: '', status: 'Active', email: '', skills: '' });
  
  useEffect(() => {
    setRows(db.getInterns());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedRows = db.updateIntern(editing.id, editing);
    setRows(updatedRows);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this intern?")) {
      const updatedRows = db.deleteIntern(id);
      setRows(updatedRows);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const updatedRows = db.addIntern(newIntern);
    setRows(updatedRows);
    setAdding(false);
    setNewIntern({ name: '', department: '', status: 'Active', email: '', skills: '' });
  };

  return (
    <Section 
      title="Intern Management" 
      subtitle="Dedicated intern category — separate from the employee dashboard."
      action={<button onClick={() => setAdding(true)} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-reude text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center gap-2"><Plus size={18}/> Add Intern</button>}
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rows.map(x => (
          <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col hover:-translate-y-1 transition-transform" key={x.id}>
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{x.name}</h3>
                <p className="text-sm text-slate-500">{x.department}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 h-fit">{x.status}</span>
            </div>
            <div className="mt-5 space-y-2 text-sm flex-1 text-slate-600 dark:text-slate-300">
              <p><b>Email:</b> {x.email || '—'}</p>
              <p><b>Skills:</b> {x.skills || '—'}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <button onClick={() => setEditing({ ...x })} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-reude transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800">
                <Edit size={14} /> Edit Details
              </button>
              <button onClick={() => handleDelete(x.id)} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl">
              <button onClick={() => setEditing(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Edit Intern</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
                    <input required value={editing.department} onChange={e => setEditing({...editing, department: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                    <select value={editing.status} onChange={e => setEditing({...editing, status: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white">
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                  <input type="email" value={editing.email || ''} onChange={e => setEditing({...editing, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Skills</label>
                  <input value={editing.skills || ''} onChange={e => setEditing({...editing, skills: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" placeholder="e.g. React, Node.js" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-reude text-white rounded-xl py-3 font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 mt-4">
                  <Save size={18} /> Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {adding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl">
              <button onClick={() => setAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Add Intern</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input required value={newIntern.name} onChange={e => setNewIntern({...newIntern, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
                    <input required value={newIntern.department} onChange={e => setNewIntern({...newIntern, department: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                    <select value={newIntern.status} onChange={e => setNewIntern({...newIntern, status: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white">
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                  <input type="email" value={newIntern.email || ''} onChange={e => setNewIntern({...newIntern, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Skills</label>
                  <input value={newIntern.skills || ''} onChange={e => setNewIntern({...newIntern, skills: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium text-slate-800 dark:text-white" placeholder="e.g. React, Node.js" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl py-3 font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 mt-4">
                  <Plus size={18} /> Create Intern
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
