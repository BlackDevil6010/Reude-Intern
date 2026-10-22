import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function Section({ title, subtitle, action, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          {action}
          <div className="hidden lg:block w-px h-8 bg-slate-200 dark:bg-slate-700 ml-2"></div>
          <button className="hidden lg:flex relative p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-500 hover:text-reude shadow-sm transition-all hover:shadow-md cursor-pointer group shrink-0">
            <Bell size={20} className="group-hover:animate-bounce" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
          </button>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
