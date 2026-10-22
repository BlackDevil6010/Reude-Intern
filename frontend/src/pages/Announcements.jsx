import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Megaphone, Trash2, X, AlertTriangle, Info, Star } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'Normal' });

  useEffect(() => {
    setAnnouncements(db.getAnnouncements());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setAnnouncements(db.addAnnouncement(newAnnouncement));
    setAdding(false);
    setNewAnnouncement({ title: '', content: '', priority: 'Normal' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this announcement?")) setAnnouncements(db.deleteAnnouncement(id));
  };

  const getPriorityIcon = (p) => {
    if (p === 'High') return <AlertTriangle size={16} className="text-red-500" />;
    if (p === 'Featured') return <Star size={16} className="text-orange-500" />;
    return <Info size={16} className="text-blue-500" />;
  };

  return (
    <Section 
      title="Company Announcements" 
      subtitle="Broadcast news, policies, and schedules to the entire workforce."
      action={<button onClick={() => setAdding(true)} className="btn-primary"><Plus size={18}/> New Broadcast</button>}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence>
          {announcements.map(a => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={a.id}
              className={`card p-6 border-l-4 \${a.priority === 'High' ? 'border-l-red-500' : a.priority === 'Featured' ? 'border-l-orange-500' : 'border-l-blue-500'} group`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(a.priority)}
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{a.title}</h3>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{a.content}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5"><Megaphone size={14}/> Broadcasted globally</span>
                <span>{a.date}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {announcements.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
            <Megaphone size={48} className="mb-4 opacity-20" />
            <p>No active announcements.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {adding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">New Broadcast</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Title</label>
                  <input required value={newAnnouncement.title} onChange={e=>setNewAnnouncement({...newAnnouncement, title: e.target.value})} className="input" placeholder="e.g. Office Closure"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Message</label>
                  <textarea required value={newAnnouncement.content} onChange={e=>setNewAnnouncement({...newAnnouncement, content: e.target.value})} className="input min-h-[120px]" placeholder="Write your announcement..."></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Priority Level</label>
                  <select value={newAnnouncement.priority} onChange={e=>setNewAnnouncement({...newAnnouncement, priority: e.target.value})} className="input">
                    <option>Normal</option>
                    <option>Featured</option>
                    <option>High</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-4">Broadcast Now</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
