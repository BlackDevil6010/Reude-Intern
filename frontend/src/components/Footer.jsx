import React from 'react';
import { ExternalLink, Database, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6">
        <div className="md:col-span-7 space-y-3">
          <img src="/reude-logo.png" className="h-7 dark:invert dark:opacity-80" alt="REUDE TECHNOLOGIES" />
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl text-xs">REUDE Technologies Engineering Department — Autonomous drone robotics, propulsion architectures, silent propellers, and mission-critical flight avionics across global engineering facilities.</p>
          <a href="https://reude.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-reude text-white px-3 py-1.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all text-[11px]">
            <ExternalLink size={12}/> Visit Official Website https://reude.in/
          </a>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] mt-2">
            <Database size={12}/> Real-Time Relational DB Active
          </div>
        </div>
        
        <div className="md:col-span-5">
          <h4 className="font-bold text-slate-800 dark:text-white mb-3 tracking-wider uppercase text-[11px]">Engineering Facilities</h4>
          <ul className="space-y-3 text-slate-500 dark:text-slate-400">
            <li className="flex gap-3">
              <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5"/>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Chennai Facility:</div>
                <div className="text-[11px]">R&D, Testing & Flight Avionics Hub</div>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5"/>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Singapore Hub:</div>
                <div className="text-[11px]">Aero-Acoustics & Systems Lab</div>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5"/>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Gurugram Center:</div>
                <div className="text-[11px]">Field Operations & Assembly</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-white/10 pt-4 pb-2 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Shield size={12} className="text-orange-500"/> Confidential Engineering Department Property. Encrypted Internal Database.
        </div>
        <div className="flex items-center gap-3">
          <span>© 2026 REUDE Technologies. All rights reserved.</span>
          <a href="https://reude.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium">
            reude.in <ExternalLink size={10}/>
          </a>
        </div>
      </div>
    </footer>
  );
}
