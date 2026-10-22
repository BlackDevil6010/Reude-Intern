import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, Sparkles, Settings, LogOut, 
  Menu, X, Bell, ClipboardList, Megaphone, Shield, UserCheck, 
  FileCheck, BarChart3, Database, Briefcase, ExternalLink, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

export default function Layout({ user, logout, isDark, toggleDark }) {
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();
  
  const role = user?.role || 'Employee';
  const isAdmin = role === 'Admin';
  const isManagement = role === 'Management';
  const isEmployee = role === 'Employee';

  // Navigation Items per Persona
  const adminNav = [
    ['Dashboard', LayoutDashboard, '/'],
    ['Employees', Users, '/employees'],
    ['Interns', GraduationCap, '/interns'],
    ['Roles & Permissions', Shield, '/roles'],
    ['User Management', UserCheck, '/users'],
    ['Audit Logs', ClipboardList, '/audit-logs'],
    ['Approvals', FileCheck, '/approvals'],
    ['Reports & Export', BarChart3, '/reports'],
    ['Data Controls', Database, '/data-controls'],
    ['Tasks', ClipboardList, '/tasks'],
    ['Announcements', Megaphone, '/announcements'],
    ['AI Assistant', Sparkles, '/assistant'],
    ['Settings', Settings, '/settings']
  ];

  const managementNav = [
    ['Dashboard', LayoutDashboard, '/'],
    ['Management Desk', Briefcase, '/management'],
    ['Employees', Users, '/employees'],
    ['Interns', GraduationCap, '/interns'],
    ['Approvals', FileCheck, '/approvals'],
    ['Reports & Export', BarChart3, '/reports'],
    ['Tasks', ClipboardList, '/tasks'],
    ['Announcements', Megaphone, '/announcements']
  ];

  const employeeNav = [
    ['My Self-Service', User, '/portal'],
    ['Employees Directory', Users, '/employees'],
    ['Interns', GraduationCap, '/interns'],
    ['Tasks', ClipboardList, '/tasks'],
    ['Announcements', Megaphone, '/announcements'],
    ['Settings & Security', Settings, '/settings']
  ];

  const activeNav = isAdmin ? adminNav : isManagement ? managementNav : employeeNav;

  return (
    <div className="h-screen flex bg-slate-50/50 dark:bg-[#0b1121] transition-colors duration-300 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-600/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }}/>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }}/>

      <aside className={`${mobile ? 'fixed inset-y-4 left-4 z-50 w-72' : 'hidden lg:flex w-72 m-5 mr-0'} bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] flex-col shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-white/10 transition-all duration-300 ease-in-out overflow-hidden z-20`}>
        {mobile && (
          <button onClick={() => setMobile(false)} className="absolute right-4 top-4 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full z-10">
            <X size={20}/>
          </button>
        )}
        <div className="p-8 pb-5 flex flex-col items-center justify-center border-b border-slate-100 dark:border-white/5 relative">
          <img src="/reude-logo.png" className="w-36 mb-5 bg-white/90 shadow-sm p-3 rounded-xl dark:invert dark:opacity-90" alt="Logo" />
          <div className="flex items-center gap-3 w-full bg-white/50 dark:bg-black/20 p-3.5 rounded-2xl border border-slate-100 dark:border-white/5 backdrop-blur-md">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-400 to-reude flex items-center justify-center shadow-lg shadow-orange-500/20 text-white text-lg font-black shrink-0 relative">
              {((user?.displayName || user?.username || 'U')[0]).toUpperCase()}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-slate-800 dark:text-white text-sm truncate">{user?.displayName || user?.display || user?.username || 'User'}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider truncate">
                Role: {user?.role || 'User'}
              </div>
            </div>
          </div>
        </div>
        
        <nav className="py-4 space-y-1.5 flex-1 overflow-y-auto px-2">
          {activeNav.map(([n, I, path]) => (
            <NavLink 
              key={path} 
              to={path} 
              onClick={() => setMobile(false)}
              className={({ isActive }) => `flex items-center gap-3.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 group relative overflow-hidden ${isActive ? 'text-white shadow-lg shadow-orange-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-r from-orange-500 to-reude z-0" />}
                  <I size={18} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="relative z-10 truncate">{n}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick link to Recrulyn only for Management */}
        {isManagement && (
          <div className="px-6 py-2">
            <a 
              href="https://recrulyn.reude.tech/" 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all text-xs font-bold group"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500 group-hover:rotate-12 transition-transform"/>
                RECRULYN AI HR
              </span>
              <ExternalLink size={12} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"/>
            </a>
          </div>
        )}
        
        <div className="p-5 flex flex-col gap-3 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Theme</span>
            <ThemeToggle isDark={isDark} toggle={toggleDark} />
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform"/> Log out
          </button>
        </div>
      </aside>
      
      <main className="flex-1 min-w-0 flex flex-col relative z-10">
        <div className="lg:hidden p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
           <img src="/reude-logo.png" className="h-8 dark:invert" alt="Logo" />
           <div className="flex items-center gap-3">
             <button className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={() => setMobile(true)}>
               <Menu size={20} className="text-slate-600 dark:text-slate-300"/>
             </button>
           </div>
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
