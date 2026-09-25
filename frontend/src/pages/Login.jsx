import React, { useState } from 'react';
import { db } from '../db';
import { motion } from 'framer-motion';

export default function Login({ onLogin }) {
  const [f, setF] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      const res = db.login(f.username, f.password);
      onLogin(res.token, res.user);
    } catch (error) {
      setErr(error.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/reude-logo.png')] bg-[length:100px] bg-repeat opacity-5 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-900/90 to-black z-0" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full z-0" 
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-reude/20 blur-[120px] rounded-full z-0" 
      />
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1050px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex z-10 hover:shadow-orange-500/10 transition-shadow duration-500"
      >
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-slate-900/80 to-black/80 p-14 flex-col justify-between text-white relative border-r border-white/10">
          <div>
            <img src="/reude-logo.png" className="w-48 mb-12 drop-shadow-2xl bg-white/90 p-4 rounded-2xl" alt="Logo" />
          </div>
          <div>
            <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-reude">
              Admin<br/>Portal
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              Secure access to REUDE TECHNOLOGIES administrative controls and operational oversight.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-1.5 bg-reude rounded-full" />
            <div className="w-3 h-1.5 bg-white/20 rounded-full" />
            <div className="w-3 h-1.5 bg-white/20 rounded-full" />
          </div>
        </div>

        <div className="w-full lg:w-[55%] flex flex-col justify-center p-10 sm:p-16 bg-white dark:bg-[#0a0a0c]">
          <form onSubmit={submit} className="w-full max-w-sm mx-auto">
            <div className="lg:hidden flex justify-center mb-10">
              <img src="/reude-logo.png" className="w-48 bg-white shadow-sm p-3 rounded-xl dark:invert" alt="Logo" />
            </div>
            
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-3">Welcome back</h1>
              <p className="text-slate-500 text-lg">Please enter your credentials (admin/password).</p>
            </div>

            {err && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 flex items-center gap-3 border border-red-100 dark:border-red-900/30">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0 font-bold">!</div>
                {err}
              </motion.div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">Username</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-reude focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-800 dark:text-white font-medium" 
                  placeholder="admin" 
                  value={f.username} 
                  onChange={e => setF({ ...f, username: e.target.value })} 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={show ? 'text' : 'password'} 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-reude focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-800 dark:text-white font-medium pr-24" 
                    placeholder="password" 
                    value={f.password} 
                    onChange={e => setF({ ...f, password: e.target.value })} 
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-4 text-sm font-bold text-slate-400 hover:text-reude transition-colors bg-white dark:bg-slate-800 px-3 py-1 rounded-lg shadow-sm border border-slate-100 dark:border-white/10">
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-reude text-white rounded-2xl mt-10 py-4 text-lg font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300" disabled={loading}>
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
