import React from 'react';
import { ExternalLink, Database, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 pt-10 border-t border-slate-200 dark:border-white/10 text-sm relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        <div className="md:col-span-5 space-y-4">
          <img src="/reude-logo.png" className="h-8 dark:invert dark:opacity-80" alt="REUDE TECHNOLOGIES" />
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">REUDE Technologies Engineering Department — Autonomous drone robotics, propulsion architectures, silent propellers, and mission-critical flight avionics across global engineering facilities.</p>
          <a href="https://reude.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-reude text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all text-xs">
            <ExternalLink size={14}/> Visit Official Website https://reude.in/
          </a>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-xs mt-4">
            <Database size={14}/> Real-Time Relational DB Active
          </div>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4 tracking-wider uppercase text-xs">Navigation</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-reude transition-colors">Dashboard Overview</a></li>
            <li><a href="#" className="hover:text-reude transition-colors">Inventory Management</a></li>
            <li><a href="#" className="hover:text-reude transition-colors">Budget Tracking</a></li>
            <li><a href="#" className="hover:text-reude transition-colors">Vendors & Procurement</a></li>
            <li><a href="#" className="hover:text-reude transition-colors">Analytics & Graphs</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4 tracking-wider uppercase text-xs">Engineering Facilities</h4>
          <ul className="space-y-4 text-slate-500 dark:text-slate-400">
            <li className="flex gap-3">
              <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5"/>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Chennai Facility:</div>
                <div className="text-xs">R&D, Testing & Flight Avionics Hub</div>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5"/>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Singapore Hub:</div>
                <div className="text-xs">Aero-Acoustics & Systems Lab</div>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5"/>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Gurugram Center:</div>
                <div className="text-xs">Field Operations & Assembly</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-white/10 pt-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-orange-500"/> Confidential Engineering Department Property. Encrypted Internal Database.
        </div>
        <div className="flex items-center gap-4">
          <span>© 2026 REUDE Technologies. All rights reserved.</span>
          <a href="https://reude.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium">
            reude.in <ExternalLink size={10}/>
          </a>
        </div>
      </div>
    </footer>
  );
}
