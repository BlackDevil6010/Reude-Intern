import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../db';
import Section from '../components/Section';
import { Plus, Search, MessageCircle, ArrowUpDown, X, Save } from 'lucide-react';
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
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(searchParams.get('status') || '');
  const [sorting, setSorting] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newEmp, setNewEmp] = useState({ first_name: '', last_name: '', work_email: '', department: '', designation: '', employment_type: 'Full-time', employment_status: 'Active' });

  useEffect(() => {
    setData(db.getEmployees());
  }, []);

  const columns = [
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
      header: '',
      cell: () => (
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-reude transition-colors">
          <MessageCircle size={18}/>
        </button>
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
      action={<button onClick={() => setAdding(true)} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-reude text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center gap-2"><Plus size={18}/> Add Employee</button>}
    >
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
    </Section>
  );
}
