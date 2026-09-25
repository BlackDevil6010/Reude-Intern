import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, Users, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { db } from '../db';
import Section from '../components/Section';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', type: 'text', content: 'Hello! I am your REUDE AI Assistant. Ask me to "show a chart" or "employee breakdown" for a rich response, or anything else.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', type: 'text', content: msg }]);
    setLoading(true);

    setTimeout(() => {
      if (msg.toLowerCase().includes('chart') || msg.toLowerCase().includes('breakdown')) {
        const d = db.getDashboard();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          type: 'chart', 
          content: 'Here is the current workforce breakdown:',
          data: [
            { name: 'Active', value: d.kpis.active },
            { name: 'On Leave', value: d.kpis.leave },
            { name: 'Interns', value: d.kpis.interns }
          ]
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          type: 'text', 
          content: 'I understand you are asking about: ' + msg + '. As an AI, I am here to help you manage REUDE operations.' 
        }]);
      }
      setLoading(false);
    }, 1000);
  };

  const renderChart = (data) => {
    const COLORS = ['#10b981', '#f43f5e', '#3b82f6'];
    return (
      <div className="h-48 w-full mt-4 bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200 dark:border-white/5">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: 'white'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-140px)] flex flex-col bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden relative">
      <div className="p-6 relative z-10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center relative shadow-xl border border-slate-700">
              <Sparkles className="text-orange-400" size={26}/>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-reude tracking-tight mb-0.5">REUDE AI</h2>
            <p className="text-emerald-500 text-sm font-medium">Online & Ready</p>
          </div>
        </div>
      </div>
      
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scroll-smooth">
        {messages.map((m, i) => (
          <motion.div initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex gap-4 max-w-[85%] lg:max-w-[75%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${m.role === 'user' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-gradient-to-tr from-slate-900 to-slate-800 text-white'}`}>
              {m.role === 'user' ? <Users size={20}/> : <Bot size={20}/>}
            </div>
            
            {m.role === 'user' ? (
              <div className="p-5 shadow-sm text-[15px] bg-gradient-to-br from-orange-400 to-reude text-white rounded-[2rem] rounded-tr-sm">
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ) : (
              <div className="p-5 shadow-sm text-[15px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-[2rem] rounded-tl-sm">
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.type === 'chart' && renderChart(m.data)}
              </div>
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-lg"><Bot size={20}/></div>
            <div className="p-6 rounded-[2rem] rounded-tl-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex gap-2 items-center">
              <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce"/>
              <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce delay-150"/>
              <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce delay-300"/>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5">
        <form onSubmit={send} className="relative flex items-center max-w-5xl mx-auto">
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            placeholder="Ask REUDE AI to show a chart or breakdown..." 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-slate-800 dark:text-slate-100" 
            disabled={loading}
          />
          <button type="submit" disabled={loading||!input.trim()} className="absolute right-2.5 w-12 h-12 bg-gradient-to-br from-orange-400 to-reude text-white rounded-full flex items-center justify-center disabled:opacity-50">
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
