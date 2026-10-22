import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Calendar, User, CheckCircle2, Circle, Clock, Trash2, X } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do', assignee: '', deadline: '' });

  useEffect(() => {
    setTasks(db.getTasks());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setTasks(db.addTask(newTask));
    setAdding(false);
    setNewTask({ title: '', description: '', status: 'To Do', assignee: '', deadline: '' });
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDrop = (e, status) => {
    const id = e.dataTransfer.getData('taskId');
    if (id) {
      setTasks(db.updateTaskStatus(parseInt(id), status));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) setTasks(db.deleteTask(id));
  };

  const columns = [
    { title: 'To Do', icon: <Circle size={16} className="text-slate-400"/>, bg: 'bg-slate-100 dark:bg-slate-800' },
    { title: 'In Progress', icon: <Clock size={16} className="text-orange-500"/>, bg: 'bg-orange-50 dark:bg-orange-900/10 border-t-2 border-orange-500' },
    { title: 'Done', icon: <CheckCircle2 size={16} className="text-emerald-500"/>, bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-t-2 border-emerald-500' }
  ];

  return (
    <Section 
      title="Task Board" 
      subtitle="Manage and assign tasks across your workforce."
      action={<button onClick={() => setAdding(true)} className="btn-primary"><Plus size={18}/> New Task</button>}
    >
      <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
        {columns.map(col => (
          <div 
            key={col.title}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, col.title)}
            className={`rounded-2xl p-4 flex flex-col \${col.bg} border border-slate-200/50 dark:border-white/5 overflow-hidden`}
          >
            <div className="flex items-center gap-2 mb-4 font-bold text-slate-700 dark:text-slate-300">
              {col.icon} {col.title} 
              <span className="ml-auto bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs shadow-sm">
                {tasks.filter(t => t.status === col.title).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
              <AnimatePresence>
                {tasks.filter(t => t.status === col.title).map(t => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={t.id}
                    draggable
                    onDragStart={e => handleDragStart(e, t.id)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                  >
                    <button onClick={() => handleDelete(t.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14}/>
                    </button>
                    <div className="flex items-start gap-2">
                      <GripVertical size={16} className="text-slate-300 mt-0.5 shrink-0"/>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1 pr-6">{t.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.description}</p>
                        
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                          {t.assignee && <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md"><User size={12}/> {t.assignee}</div>}
                          {t.deadline && <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-md"><Calendar size={12}/> {t.deadline}</div>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {adding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Create Task</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Title</label>
                  <input required value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} className="input" placeholder="e.g. Design Landing Page"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description</label>
                  <textarea required value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})} className="input min-h-[100px]" placeholder="Details..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Assignee</label>
                    <input value={newTask.assignee} onChange={e=>setNewTask({...newTask, assignee: e.target.value})} className="input" placeholder="Name"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Deadline</label>
                    <input type="date" value={newTask.deadline} onChange={e=>setNewTask({...newTask, deadline: e.target.value})} className="input"/>
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-4">Create Task</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
