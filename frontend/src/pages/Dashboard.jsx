import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { Users, GraduationCap, CheckSquare, CalendarDays, Bell, Clock3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const [d, setD] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setD(db.getDashboard());
  }, []);

  if (!d) return null;

  const k = [
    ['Total Employees', d.kpis.employees, Users, 'from-orange-500 to-reude', ''],
    ['Total Interns', d.kpis.interns, GraduationCap, 'from-blue-500 to-blue-700', ''],
    ['Active Staff', d.kpis.active, CheckSquare, 'from-emerald-400 to-emerald-600', 'Active'],
    ['On Leave', d.kpis.leave, CalendarDays, 'from-rose-400 to-rose-600', 'On Leave']
  ];

  const distData = [
    { name: 'Active Persons', value: d.kpis.active + d.kpis.interns, filter: 'Active' },
    { name: 'Total Employees', value: d.kpis.employees, filter: '' },
    { name: 'Total Interns', value: d.kpis.interns, filter: 'interns' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome to HQ</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Here's what's happening at REUDE TECHNOLOGIES today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <CalendarDays size={18} className="text-slate-400 dark:text-slate-500"/> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {k.map(([a, b, I, grad, filterStr], i) => (
          <motion.div 
            variants={item} 
            key={a}
            onClick={() => filterStr !== null && navigate(filterStr === '' ? '/employees' : `/employees?status=\${filterStr}`)}
            className="relative overflow-hidden rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1.5 transition-all duration-500 group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 cursor-pointer"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <I size={28} className={i===0?"text-reude":i===1?"text-blue-600":i===2?"text-emerald-500":"text-rose-500"}/>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{b}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{a}</div>
            </div>
            <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br \${grad} rounded-full opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 space-y-8">
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-reude to-orange-600"/>
            <h2 className="text-2xl font-black mb-8 text-slate-800 dark:text-white tracking-tight flex justify-between items-center">
              Workforce Overview
              <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Click bars to filter</span>
            </h2>
            <div className="h-[350px]">
              <ResponsiveContainer>
                <BarChart data={distData} margin={{top: 20, right: 20, left: 0, bottom: 0}}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#64748b', fontSize: 12, fontWeight: 600, dy: 10}}/>
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:'#64748b', fontSize: 12, fontWeight: 600}}/>
                  <Tooltip cursor={{fill: 'rgba(244,105,0,0.04)'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px', fontWeight: 'bold', color: '#1e293b'}}/>
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={80} onClick={(data) => {
                    if (data.payload.filter === 'interns') navigate('/interns');
                    else navigate(`/employees?status=\${data.payload.filter}`);
                  }}>
                    {distData.map((entry, index) => (
                      <Cell key={`cell-\${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#F46900'} className="cursor-pointer hover:opacity-80 transition-opacity" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-white/10 flex flex-col">
          <h2 className="text-2xl font-black mb-8 text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            <Clock3 className="text-reude" size={24}/> Live Activity
          </h2>
          <div className="flex-1 overflow-y-auto pr-4 space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
            {d.recent.map((x, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} key={x.id} className="relative flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 group-hover:bg-reude group-hover:text-white transition-colors duration-300 font-bold shrink-0 shadow-sm z-10">
                  {(x.username||'S')[0].toUpperCase()}
                </div>
                <div className="ml-4 w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:border-reude/30 group-hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-800 dark:text-white text-sm truncate">{x.username||'System'}</div>
                    <time className="text-xs font-medium text-slate-400">{new Date(x.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</time>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm leading-tight">{x.action}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
