import React from 'react';
import { motion } from 'framer-motion';

export default function Section({ title, subtitle, action, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
