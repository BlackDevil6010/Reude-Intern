import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { 
  Target, Award, TrendingUp, Star, Plus, CheckCircle2, 
  BarChart2, Flame, UserCheck, ShieldCheck, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Performance() {
  const [okrs, setOkrs] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [interns, setInterns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newOkrModal, setNewOkrModal] = useState(false);
  const [newAppraisalModal, setNewAppraisalModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const role = currentUser?.role || 'Employee';
  const canManage = role === 'Admin' || role === 'Management';

  const [okrForm, setOkrForm] = useState({ title: '', category: 'R&D Engineering', quarter: 'Q4 2026', user_id: '1', employee_name: 'Deepak Raj', progress: 50 });
  const [appraisalForm, setAppraisalForm] = useState({ employee_name: 'Deepak Raj', rating: 5, reviewer: currentUser?.username || 'Management', strengths: 'SolidWorks, Fast learning, Drone control', feedback: 'Consistently meets project avionics milestones.', promotion_recommendation: 'Senior Design Engineer' });

  const loadData = () => {
    setOkrs(db.getOKRs());
    setAppraisals(db.getAppraisals());
    setInterns(db.getInterns());
    setEmployees(db.getEmployees());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProgress = (id, newProgress) => {
    db.updateOKRProgress(id, newProgress, currentUser?.username || 'user');
    loadData();
  };

  const handleCreateOKR = (e) => {
    e.preventDefault();
    db.addOKR({
      ...okrForm,
      progress: Number(okrForm.progress),
      status: Number(okrForm.progress) >= 70 ? 'On Track' : 'In Progress'
    }, currentUser?.username || 'user');
    setNewOkrModal(false);
    loadData();
  };

  const handleCreateAppraisal = (e) => {
    e.preventDefault();
    db.addAppraisal({
      ...appraisalForm,
      rating: Number(appraisalForm.rating),
      cycle: 'Q4 2026'
    }, currentUser?.username || 'user');
    setNewAppraisalModal(false);
    loadData();
  };

  // Top performers list
  const topInterns = [...interns].sort((a, b) => (b.performance || 0) - (a.performance || 0)).slice(0, 4);

  return (
    <Section 
      title="Performance, OKRs & Appraisals" 
      subtitle="Quarterly goal tracking, structured supervisor appraisals, and intern conversion readiness."
      action={
        <div className="flex gap-2">
          <button onClick={() => setNewOkrModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
            <Plus size={14} /> Add OKR Goal
          </button>
          {canManage && (
            <button onClick={() => setNewAppraisalModal(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Award size={14} /> Record Appraisal
            </button>
          )}
        </div>
      }
    >
      {/* 1. Leaderboard & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Target size={20} className="text-orange-500" /> Active OKRs & Key Milestones
              </h3>
              <p className="text-xs text-slate-400">Quarterly departmental objectives and completion tracking</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-full">
              Q4 2026 Cycle
            </span>
          </div>

          <div className="space-y-4">
            {okrs.map(o => (
              <div key={o.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">{o.title}</h4>
                    <span className="text-xs text-slate-400">{o.category} · Assigned: {o.employee_name || o.intern_name || 'Staff'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    o.status === 'Ahead' || o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {o.status} ({o.progress}%)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-reude rounded-full transition-all duration-300"
                    style={{ width: `${o.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Adjust Progress:</span>
                  <div className="flex gap-1.5">
                    {[25, 50, 75, 100].map(val => (
                      <button
                        key={val}
                        onClick={() => handleUpdateProgress(o.id, val)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          o.progress === val ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performer Leaderboard */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <Flame size={14} /> Conversion Leaderboard
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                Top Rated Interns
              </span>
            </div>

            <h3 className="text-xl font-black mb-2 text-white">Full-time Ready Candidates</h3>
            <p className="text-xs text-slate-400 mb-6">Interns eligible for immediate full-time employee conversion</p>

            <div className="space-y-3">
              {topInterns.map((int, idx) => (
                <div key={int.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white">{int.name}</div>
                      <div className="text-[10px] text-slate-400">{int.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-black text-xs">★ {int.performance || 5}/5</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">{int.duration} Done</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 text-center">
            Evaluated by Engineering Supervisors & Leads
          </div>
        </div>
      </div>

      {/* 2. Structured Appraisals Grid */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Formal Staff Appraisal Records</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appraisals.map(a => (
            <div key={a.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">{a.employee_name}</h4>
                  <span className="text-xs text-slate-400">Reviewed by {a.reviewer} · Cycle: {a.cycle}</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-black text-sm flex items-center gap-1">
                  <Star size={14} fill="currentColor" /> {a.rating} / 5.0
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Core Strengths:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">{a.strengths}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Executive Review Feedback:</span>
                  <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    "{a.feedback}"
                  </p>
                </div>
                {a.promotion_recommendation && (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Promotion Track:</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      {a.promotion_recommendation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW OKR MODAL */}
      <AnimatePresence>
        {newOkrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewOkrModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setNewOkrModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={20} /></button>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Add Quarterly OKR</h3>
              <form onSubmit={handleCreateOKR} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Objective / Goal Title</label>
                  <input required value={okrForm.title} onChange={e => setOkrForm({...okrForm, title: e.target.value})} className="input" placeholder="e.g. Avionics telemetry testing" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Department / Category</label>
                  <input required value={okrForm.category} onChange={e => setOkrForm({...okrForm, category: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Assigned Person</label>
                  <select value={okrForm.employee_name} onChange={e => setOkrForm({...okrForm, employee_name: e.target.value})} className="input">
                    {employees.map(e => <option key={e.id} value={`${e.first_name} ${e.last_name}`}>{e.first_name} {e.last_name}</option>)}
                    {interns.map(i => <option key={`int-${i.id}`} value={i.name}>{i.name} (Intern)</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Initial Progress (%)</label>
                  <input type="number" min="0" max="100" value={okrForm.progress} onChange={e => setOkrForm({...okrForm, progress: e.target.value})} className="input" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Create OKR</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW APPRAISAL MODAL */}
      <AnimatePresence>
        {newAppraisalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewAppraisalModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setNewAppraisalModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={20} /></button>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Record Staff Appraisal</h3>
              <form onSubmit={handleCreateAppraisal} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Employee</label>
                  <select value={appraisalForm.employee_name} onChange={e => setAppraisalForm({...appraisalForm, employee_name: e.target.value})} className="input">
                    {employees.map(e => <option key={e.id} value={`${e.first_name} ${e.last_name}`}>{e.first_name} {e.last_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Rating (1 to 5 Stars)</label>
                  <input type="number" step="0.1" min="1" max="5" value={appraisalForm.rating} onChange={e => setAppraisalForm({...appraisalForm, rating: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Key Strengths</label>
                  <input value={appraisalForm.strengths} onChange={e => setAppraisalForm({...appraisalForm, strengths: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Reviewer Feedback</label>
                  <textarea value={appraisalForm.feedback} onChange={e => setAppraisalForm({...appraisalForm, feedback: e.target.value})} className="input h-20 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Promotion Track Recommendation</label>
                  <input value={appraisalForm.promotion_recommendation} onChange={e => setAppraisalForm({...appraisalForm, promotion_recommendation: e.target.value})} className="input" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Submit Appraisal</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
