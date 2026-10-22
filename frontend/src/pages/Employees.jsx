import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../db';
import Section from '../components/Section';
import { Plus, Search, ClipboardList, CheckCircle, ArrowUpDown, X, Save, Upload, GraduationCap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

export default function Employees() {
  const user = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const isAdmin = user?.role === 'Admin';
  const isManagement = user?.role === 'Management';
  const canManage = isAdmin || isManagement;
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(searchParams.get('status') || '');
  const [sorting, setSorting] = useState([]);
  const [adding, setAdding] = useState(false);
  const [todoModal, setTodoModal] = useState(null);
  const [supervisorModal, setSupervisorModal] = useState(null);
  const [supervisedInterns, setSupervisedInterns] = useState([]);
  const [empTasks, setEmpTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [newEmp, setNewEmp] = useState({ first_name: '', last_name: '', work_email: '', department: '', designation: '', employment_type: 'Full-time', employment_status: 'Active' });

  useEffect(() => {
    setData(db.getEmployees());
    if (todoModal) {
      const allTasks = db.getTasks();
      setEmpTasks(allTasks.filter(t => t.assignee === todoModal.first_name));
    }
    if (supervisorModal) {
      const allInterns = db.getInterns();
      const empName = [supervisorModal.first_name, supervisorModal.last_name].filter(Boolean).join(' ');
      setSupervisedInterns(allInterns.filter(i => i.supervisor === empName));
    }
  }, [todoModal, supervisorModal]);

  const handleUpdateInternRating = (internId, rating) => {
    db.updateIntern(internId, { performance: rating });
    // Refresh interns list
    const allInterns = db.getInterns();
    const empName = [supervisorModal.first_name, supervisorModal.last_name].filter(Boolean).join(' ');
    setSupervisedInterns(allInterns.filter(i => i.supervisor === empName));
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    db.addTask({
      title: newTask.title,
      description: newTask.description,
      status: 'To Do',
      assignee: todoModal.first_name,
      deadline: new Date().toISOString().split('T')[0],
      acknowledged: false
    });
    setNewTask({ title: '', description: '' });
    setEmpTasks(db.getTasks().filter(t => t.assignee === todoModal.first_name));
  };

  const handleAcknowledge = (taskId) => {
    db.updateTask(taskId, { acknowledged: true });
    setEmpTasks(db.getTasks().filter(t => t.assignee === todoModal.first_name));
  };

  const columns = [
    { accessorKey: 'employee_id', header: 'ID', cell: info => <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{info.getValue() || 'N/A'}</span> },
    {
      accessorKey: 'first_name',
      header: 'Employee',
      cell: info => {
        const row = info.row.original;
        return (
          <div>
            <div className="font-semibold text-slate-800 dark:text-white">
              {[row.first_name, row.last_name].filter(Boolean).join(' ')}
            </div>
            <div className="text-xs text-slate-500">{row.work_email}</div>
          </div>
        );
      }
    },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'employment_type', header: 'Type' },
    {
      accessorKey: 'employment_status',
      header: 'Status',
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold \${info.getValue() === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
          {info.getValue()}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Manage',
      cell: info => (
        <div className="flex gap-2">
          <button 
            onClick={() => setTodoModal(info.row.original)}
            title="Assign To-Do"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-reude transition-colors"
          >
            <ClipboardList size={18}/>
          </button>
          <button 
            onClick={() => setSupervisorModal(info.row.original)}
            title="Supervise Interns"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <GraduationCap size={18}/>
          </button>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } }
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const updated = db.addEmployee(newEmp);
    setData(updated);
    setAdding(false);
    setNewEmp({ first_name: '', last_name: '', work_email: '', department: '', designation: '', employment_type: 'Full-time', employment_status: 'Active' });
  };

  return (
    <Section 
      title="Employees" 
      subtitle="Manage your workforce data using TanStack Table." 
      action={
        isAdmin && (
        <div className="flex gap-3">
          <label className="cursor-pointer px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
            <Upload size={18}/> Upload Excel
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => {
              if(e.target.files.length > 0) alert('Excel upload logic will be implemented here');
            }} />
          </label>
          <button onClick={() => setAdding(true)} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-reude text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center gap-2">
            <Plus size={18}/> Add Employee
          </button>
        </div>
        )
      }>
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none">
        
        <div className="relative max-w-md mb-6">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 pl-12 focus:outline-none focus:border-reude focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium dark:text-white"
            placeholder="Search employee, email, or status..." 
            value={globalFilter} 
            onChange={e => setGlobalFilter(e.target.value)} 
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id} className="p-4 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={h.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-2">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && <ArrowUpDown size={14} className="opacity-50"/>}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-4 align-middle text-slate-600 dark:text-slate-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 disabled:opacity-50 transition-colors" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
            <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 disabled:opacity-50 transition-colors" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {adding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl">
              <button onClick={() => setAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Add Employee</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">First Name</label>
                    <input required value={newEmp.first_name} onChange={e => setNewEmp({...newEmp, first_name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Last Name</label>
                    <input required value={newEmp.last_name} onChange={e => setNewEmp({...newEmp, last_name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Work Email</label>
                  <input required type="email" value={newEmp.work_email} onChange={e => setNewEmp({...newEmp, work_email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
                    <input required value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Designation</label>
                    <input required value={newEmp.designation} onChange={e => setNewEmp({...newEmp, designation: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-reude text-sm font-medium dark:text-white" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-reude text-white rounded-xl py-3 font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 mt-4">
                  <Plus size={18} /> Create Employee
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {todoModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTodoModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-lg relative z-10 shadow-2xl">
              <button onClick={() => setTodoModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">To-Do List: {todoModal.first_name}</h2>
              <p className="text-sm text-slate-500 mb-6">Assign work (e.g. if you are taking leave) or check status.</p>
              
              <div className="max-h-[40vh] overflow-y-auto mb-6 space-y-3">
                {empTasks.length === 0 ? (
                  <div className="text-slate-400 text-sm text-center py-4">No tasks assigned yet.</div>
                ) : (
                  empTasks.map(t => (
                    <div key={t.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-md font-bold \${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{t.status}</span>
                        {t.acknowledged ? (
                          <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle size={12}/> Seen</span>
                        ) : (
                          <button onClick={() => handleAcknowledge(t.id)} className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-2 py-1 rounded-md transition-colors">Mark Seen</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAssignTask} className="border-t border-slate-100 dark:border-white/10 pt-6">
                <h3 className="font-bold text-sm mb-3 text-slate-800 dark:text-white">Assign New Task</h3>
                <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task Title (e.g. Please handle my shift)" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-reude text-slate-800 dark:text-white" />
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Details..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-reude h-20 resize-none text-slate-800 dark:text-white" />
                <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-reude text-white rounded-xl py-2.5 font-bold text-sm shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">Assign Task</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {supervisorModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSupervisorModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-2xl relative z-10 shadow-2xl">
              <button onClick={() => setSupervisorModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Supervise Interns</h2>
              <p className="text-sm text-slate-500 mb-6">Interns reporting to {[supervisorModal.first_name, supervisorModal.last_name].filter(Boolean).join(' ')}</p>
              
              <div className="max-h-[50vh] overflow-y-auto mb-2 space-y-4">
                {supervisedInterns.length === 0 ? (
                  <div className="text-slate-400 text-sm text-center py-8">No interns assigned to this supervisor.</div>
                ) : (
                  supervisedInterns.map(i => (
                    <div key={i.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 dark:text-white text-lg">{i.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">{i.department}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-2"><strong>Task:</strong> {i.task_assigned || 'None assigned'}</p>
                        <p className="text-sm text-slate-500"><strong>Skills:</strong> {i.skills}</p>
                      </div>
                      { !isAdmin && ( 
<div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Performance Rate</p>
                        <div className="flex gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              onClick={() => handleUpdateInternRating(i.id, star)}
                              className={`p-1 transition-colors \${(i.performance || 0) >= star ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700 hover:text-yellow-200'}`}
                            >
                              <Star size={20} fill={(i.performance || 0) >= star ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
)}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
