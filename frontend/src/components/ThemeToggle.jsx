import React from 'react';

export default function ThemeToggle({ isDark, toggle }) {
  return (
    <label className="relative w-16 h-8 rounded-full cursor-pointer overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 block shrink-0">
      <input type="checkbox" className="sr-only" checked={isDark} onChange={toggle} />
      <div className={`absolute inset-0 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
      <div className={`absolute inset-0 bg-gradient-to-r from-[#243949] to-[#517fa4] transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1.5 left-2.5 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]" />
        <div className="absolute top-4 left-5 w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_2px_white]" />
        <div className="absolute top-5 left-2 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]" />
        <div className="absolute top-2.5 left-7 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]" />
      </div>
      <div className={`absolute bottom-[-2px] right-1 transition-transform duration-500 ${isDark ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="w-7 h-3.5 bg-white rounded-full relative">
          <div className="absolute -top-1.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full" />
          <div className="absolute -top-2 right-0.5 w-4 h-4 bg-white rounded-full" />
        </div>
      </div>
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-500 flex items-center justify-center overflow-hidden ${isDark ? 'translate-x-8 bg-[#cbd5e1] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)]' : 'translate-x-0 bg-[#fdd835] shadow-[inset_-2px_-2px_4px_rgba(200,100,0,0.5)]'}`}>
        <div className={`absolute transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1 left-3 w-1.5 h-1.5 bg-black/15 rounded-full" />
          <div className="absolute top-3 left-1 w-1 h-1 bg-black/15 rounded-full" />
          <div className="absolute top-3.5 left-3.5 w-2 h-2 bg-black/15 rounded-full" />
        </div>
      </div>
    </label>
  );
}
