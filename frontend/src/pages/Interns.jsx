import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Edit, Trash2, X, Save, Plus, Upload, GraduationCap, Calendar, Star, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/Section';

export default function Interns() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [viewingResume, setViewingResume] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [newIntern, setNewIntern] = useState({ name: '', department: '', status: 'Active', email: '', skills: '', start_date: '', end_date: '', performance: 0, duration: '', working_mode: 'onsite', place: '', task_assigned: '', supervisor: '' });

  useEffect(() => {
    setRows(db.getInterns());
    setEmployees(db.getEmployees());
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

  const handleConvert = (id) => {
    if (window.confirm("Convert this intern to a full-time Employee?")) {
      const updatedRows = db.convertInternToEmployee(id);
      setRows(updatedRows);
      alert("Successfully converted to Employee!");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const updatedRows = db.addIntern(newIntern);
    setRows(updatedRows);
    setAdding(false);
    setNewIntern({ name: '', department: '', status: 'Active', email: '', skills: '', start_date: '', end_date: '', performance: 0, duration: '', working_mode: 'onsite', place: '', task_assigned: '', supervisor: '' });
  };

  const calculateProgress = (start, end) => {
    if (!start || !end) return { percent: 0, daysLeft: 0 };
    const s = new Date(start);
    const e = new Date(end);
    const now = new Date();
    if (now < s) return { percent: 0, daysLeft: Math.ceil((e - now) / (1000 * 60 * 60 * 24)) };
    if (now > e) return { percent: 100, daysLeft: 0 };
    const total = e - s;
    const elapsed = now - s;
    return { 
      percent: Math.min(100, Math.max(0, (elapsed / total) * 100)),
      daysLeft: Math.ceil((e - now) / (1000 * 60 * 60 * 24))
    };
  };

  return (
    <Section 
      title="Intern Management" 
      subtitle="Comprehensive tracking, performance, and conversion workflow."
      action={
        <div className="flex gap-3">
          <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-5 py-2.5 font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
            <Upload size={18}/> Parse Resume
            <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => {
              const file = e.target.files[0];
              if(file) {
                const textReader = new FileReader();
                textReader.onload = (evtText) => {
                  const text = evtText.target.result;
                  
                  const urlReader = new FileReader();
                  urlReader.onload = (evtUrl) => {
                    const dataUrl = evtUrl.target.result;
                    
                    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                    const email = emailMatch ? emailMatch[0] : '';
                    const allSkills = ['React', 'Node', 'Python', 'Java', 'SQL', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Express', 'TypeScript', 'Next.js', 'Git'];
                    const foundSkills = allSkills.filter(s => new RegExp(s, 'i').test(text));
                    
                    const newIntern = {
                      name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                      department: 'Full Stack Developer intern',
                      status: 'Active',
                      email: email,
                      skills: foundSkills.join(', '),
                      start_date: new Date().toISOString().split('T')[0],
                      end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
                      performance: 0,
                      resume_uploaded: true,
                      resume_url: dataUrl
                    };
                    
                    try {
                      const updatedRows = db.addIntern(newIntern);
                      setRows(updatedRows);
                    } catch (err) {
                      alert("Error saving resume (file might be too large for local storage prototype).");
                    }
                  };
                  urlReader.readAsDataURL(file);
                };
                textReader.readAsText(file);
              }
              e.target.value = null;
            }} />
          </label>
          <button onClick={() => setAdding(true)} className="btn-primary"><Plus size={18}/> Add Intern</button>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rows.map(x => {
          const { percent, daysLeft } = calculateProgress(x.start_date, x.end_date);
          return (
            <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card p-6 flex flex-col hover:-translate-y-1" key={x.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                    {x.name} <span className="font-mono text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{x.intern_id || 'N/A'}</span>
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">{x.department}</p>
                </div>
                <span className={`badge \${x.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{x.status}</span>
              </div>

              {x.start_date && x.end_date && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {daysLeft} days left</span>
                    <span>{Math.round(percent)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-reude h-2 rounded-full transition-all duration-500" style={{ width: `\${percent}%` }}></div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm flex-1 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><div className="w-20 font-semibold">Email:</div> {x.email || '—'}</div>
                <div className="flex items-center gap-2"><div className="w-20 font-semibold">Skills:</div> <div className="truncate">{x.skills || '—'}</div></div>
                <div className="flex items-center gap-2"><div className="w-20 font-semibold">Duration:</div> {x.duration || '—'}</div>
                <div className="flex items-center gap-2"><div className="w-20 font-semibold">Mode:</div> {x.working_mode || '—'} {x.place ? `(${x.place})` : ''}</div>
                <div className="flex items-center gap-2"><div className="w-20 font-semibold">Supervisor:</div> {x.supervisor || '—'}</div>
                <div className="flex items-center gap-2"><div className="w-20 font-semibold">Task:</div> <div className="truncate">{x.task_assigned || '—'}</div></div>
                {x.performance > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 font-semibold">Rating:</div> 
                    <div className="flex gap-0.5 text-orange-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < x.performance ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                )}
                
                {x.resume_uploaded && (
                  <button onClick={() => setViewingResume(x)} className="flex items-center gap-2 text-blue-500 text-xs font-bold mt-2 bg-blue-50 dark:bg-blue-900/20 w-fit px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                    <FileText size={14}/> View Resume
                  </button>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 flex-wrap">
                <label className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10">
                  <Upload size={14} /> Resume
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => {
                    const file = e.target.files[0];
                    if(file) {
                      const textReader = new FileReader();
                      textReader.onload = (evtText) => {
                        const text = evtText.target.result;
                        
                        const urlReader = new FileReader();
                        urlReader.onload = (evtUrl) => {
                          const dataUrl = evtUrl.target.result;
                          
                          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                          const email = emailMatch ? emailMatch[0] : x.email;
                          const allSkills = ['React', 'Node', 'Python', 'Java', 'SQL', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Express', 'TypeScript', 'Next.js', 'Git'];
                          const foundSkills = allSkills.filter(s => new RegExp(s, 'i').test(text));
                          const skills = foundSkills.length > 0 ? foundSkills.join(', ') : x.skills;
                          
                          try {
                            const updated = db.updateIntern(x.id, { 
                              resume_uploaded: true,
                              resume_url: dataUrl,
                              email: email,
                              skills: skills,
                              department: 'Full Stack Developer intern'
                            });
                            setRows(updated);
                          } catch (err) {
                            alert("Error saving resume (file might be too large for local storage prototype).");
                          }
                        };
                        urlReader.readAsDataURL(file);
                      };
                      textReader.readAsText(file);
                    }
                    e.target.value = null;
                  }} />
                </label>
                <button onClick={() => setEditing({ ...x })} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-reude transition-colors px-2 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleConvert(x.id)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                  <GraduationCap size={14} /> Convert
                </button>
                <button onClick={() => handleDelete(x.id)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 ml-auto">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {(editing || adding) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => editing ? setEditing(null) : setAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="card p-8 w-full max-w-2xl relative z-10">
              <button onClick={() => editing ? setEditing(null) : setAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">{editing ? 'Edit Intern Profile' : 'Add New Intern'}</h2>
              
              <form onSubmit={editing ? handleSave : handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                    <input required value={(editing || newIntern).name} onChange={e => editing ? setEditing({...editing, name: e.target.value}) : setNewIntern({...newIntern, name: e.target.value})} className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                    <input type="email" value={(editing || newIntern).email || ''} onChange={e => editing ? setEditing({...editing, email: e.target.value}) : setNewIntern({...newIntern, email: e.target.value})} className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
                    <input required value={(editing || newIntern).department} onChange={e => editing ? setEditing({...editing, department: e.target.value}) : setNewIntern({...newIntern, department: e.target.value})} className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                    <select value={(editing || newIntern).status} onChange={e => editing ? setEditing({...editing, status: e.target.value}) : setNewIntern({...newIntern, status: e.target.value})} className="input pr-8">
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Start Date</label>
                    <input type="date" value={(editing || newIntern).start_date || ''} onChange={e => editing ? setEditing({...editing, start_date: e.target.value}) : setNewIntern({...newIntern, start_date: e.target.value})} className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">End Date</label>
                    <input type="date" value={(editing || newIntern).end_date || ''} onChange={e => editing ? setEditing({...editing, end_date: e.target.value}) : setNewIntern({...newIntern, end_date: e.target.value})} className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Skills</label>
                    <input value={(editing || newIntern).skills || ''} onChange={e => editing ? setEditing({...editing, skills: e.target.value}) : setNewIntern({...newIntern, skills: e.target.value})} className="input" placeholder="e.g. React, Node.js" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Performance Rating (1-5)</label>
                    <input type="number" min="0" max="5" value={(editing || newIntern).performance || 0} onChange={e => editing ? setEditing({...editing, performance: parseInt(e.target.value)||0}) : setNewIntern({...newIntern, performance: parseInt(e.target.value)||0})} className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Duration</label>
                    <input value={(editing || newIntern).duration || ''} onChange={e => editing ? setEditing({...editing, duration: e.target.value}) : setNewIntern({...newIntern, duration: e.target.value})} className="input" placeholder="e.g. 6 Months" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Working Mode</label>
                    <select value={(editing || newIntern).working_mode || 'onsite'} onChange={e => editing ? setEditing({...editing, working_mode: e.target.value}) : setNewIntern({...newIntern, working_mode: e.target.value})} className="input pr-8">
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Place</label>
                    <input value={(editing || newIntern).place || ''} onChange={e => editing ? setEditing({...editing, place: e.target.value}) : setNewIntern({...newIntern, place: e.target.value})} className="input" placeholder="e.g. New York Office" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Supervisor (Employee)</label>
                    <select value={(editing || newIntern).supervisor || ''} onChange={e => editing ? setEditing({...editing, supervisor: e.target.value}) : setNewIntern({...newIntern, supervisor: e.target.value})} className="input pr-8">
                      <option value="">-- Select Supervisor --</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={[emp.first_name, emp.last_name].filter(Boolean).join(' ')}>{[emp.first_name, emp.last_name].filter(Boolean).join(' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Task Assign</label>
                  <input value={(editing || newIntern).task_assigned || ''} onChange={e => editing ? setEditing({...editing, task_assigned: e.target.value}) : setNewIntern({...newIntern, task_assigned: e.target.value})} className="input" placeholder="e.g. Setup backend DB" />
                </div>

                <button type="submit" className="w-full btn-primary py-3 mt-4">
                  {editing ? <><Save size={18} /> Save Changes</> : <><Plus size={18} /> Create Intern</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {viewingResume && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingResume(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="card p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative z-10">
              <button onClick={() => setViewingResume(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Resume: {viewingResume.name}</h2>
              {viewingResume.resume_url ? (
                <iframe src={viewingResume.resume_url} className="w-full h-[60vh] rounded-xl border-none"></iframe>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                  No visual document available for this resume.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
