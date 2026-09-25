import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Sparkles, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const nav = [
  ['Dashboard', LayoutDashboard, '/'],
  ['Employees', Users, '/employees'],
  ['Interns', GraduationCap, '/interns'],
  ['AI Assistant', Sparkles, '/assistant'],
  ['Settings', Settings, '/settings']
];

export default function Layout({ user, logout, isDark, toggleDark }) {
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();
  
  const isAdmin = ['Admin', 'HR', 'Manager', 'Team Lead'].includes(user.role);
  const allowed = nav.filter(([n]) => isAdmin || ['Dashboard', 'Settings'].includes(n));

  return (
    <div className="h-screen flex bg-slate-50/50 dark:bg-[#0b1121] transition-colors duration-300 overflow-hidden relative">
      
      {/* Advanced Glassmorphism: Animated Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-600/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }}/>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }}/>

      <aside className={`\${mobile ? 'fixed inset-y-4 left-4 z-50 w-72' : 'hidden lg:flex w-72 m-5 mr-0'} bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] flex-col shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-white/10 transition-all duration-300 ease-in-out overflow-hidden z-20`}>
        {mobile && (
          <button onClick={() => setMobile(false)} className="absolute right-4 top-4 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full z-10">
            <X size={20}/>
          </button>
        )}
        <div className="p-8 pb-6 flex flex-col items-center justify-center border-b border-slate-100 dark:border-white/5 relative">
          <img src="/reude-logo.png" className="w-36 mb-6 bg-white/90 shadow-sm p-3 rounded-xl dark:invert dark:opacity-90" alt="Logo" />
          <div className="flex items-center gap-4 w-full bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-reude flex items-center justify-center shadow-lg shadow-orange-500/20 text-white text-xl font-black shrink-0 relative">
              {((user?.displayName || user?.username || 'U')[0]).toUpperCase()}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-slate-800 dark:text-white text-sm truncate">{user?.displayName || user?.username || 'User'}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">{user?.role || 'User'}</div>
            </div>
          </div>
        </div>
        
        <nav className="py-6 space-y-2 flex-1 overflow-y-auto">
          {allowed.map(([n, I, path]) => (
            <NavLink 
              key={path} 
              to={path} 
              onClick={() => setMobile(false)}
              className={({ isActive }) => `w-[90%] flex items-center gap-4 pl-8 pr-4 py-4 rounded-r-3xl text-sm font-bold transition-all duration-300 group relative overflow-hidden \${isActive ? 'text-white shadow-lg shadow-orange-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-r from-orange-500 to-reude z-0" />}
                  <I size={20} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 \${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="relative z-10">{n}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 shadow-inner">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Theme</span>
            <ThemeToggle isDark={isDark} toggle={toggleDark} />
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/> Log out
          </button>
        </div>
      </aside>
      
      <main className="flex-1 min-w-0 flex flex-col relative z-10">
        <div className="lg:hidden p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
           <img src="/reude-logo.png" className="h-8 dark:invert" alt="Logo" />
           <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={() => setMobile(true)}>
             <Menu size={20} className="text-slate-600 dark:text-slate-300"/>
           </button>
        </div>
        
        <div className="p-6 lg:p-10 flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
          <Footer />
        </div>
      </main>
    </div>
  );
}
