import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { exportToCSV } from '../utils/exportUtils';
import { 
  CreditCard, Plus, CheckCircle2, XCircle, Clock, 
  Receipt, Download, FileText, Check, X, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newClaimModal, setNewClaimModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const role = currentUser?.role || 'Employee';
  const canApprove = role === 'Admin' || role === 'Management';

  const [claimForm, setClaimForm] = useState({ title: '', category: 'Hardware/Tools', amount: '', receipt_name: 'receipt_upload.pdf' });

  const loadData = () => {
    setExpenses(db.getExpenses());
    setEmployees(db.getEmployees());
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentEmp = employees.find(e => 
    String(e.id) === String(currentUser?.id) || 
    String(e.user_id) === String(currentUser?.id) ||
    e.first_name.toLowerCase() === (currentUser?.username || '').toLowerCase()
  ) || employees[0];

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!claimForm.amount) return;
    db.submitExpense({
      user_id: currentEmp?.id || '1',
      employee_name: `${currentEmp?.first_name || 'Staff'} ${currentEmp?.last_name || ''}`.trim(),
      title: claimForm.title,
      category: claimForm.category,
      amount: Number(claimForm.amount),
      receipt_name: claimForm.receipt_name || 'invoice_proof.pdf'
    }, currentUser?.username || 'Employee');
    setNewClaimModal(false);
    setClaimForm({ title: '', category: 'Hardware/Tools', amount: '', receipt_name: 'receipt_upload.pdf' });
    loadData();
  };

  const handleApprove = (id) => {
    db.updateExpenseStatus(id, 'Approved', 'Approved by Management for disbursement', currentUser?.username || 'management');
    loadData();
  };

  const handleReject = (id) => {
    const reason = prompt('Enter rejection reason:') || 'Documentation incomplete';
    db.updateExpenseStatus(id, 'Rejected', reason, currentUser?.username || 'management');
    loadData();
  };

  const totalClaimed = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalApproved = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalPending = expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const handleExportCSV = () => {
    const rows = expenses.map(e => ({
      ID: e.id,
      Employee: e.employee_name,
      Title: e.title,
      Category: e.category,
      Amount: e.amount,
      Date: e.date,
      Status: e.status,
      ManagerComment: e.manager_comment || ''
    }));
    exportToCSV(`reude_expense_claims_${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <Section 
      title="Expense Reimbursements & Claims" 
      subtitle="Submit business purchases, equipment claims, and review approvals."
      action={
        <div className="flex gap-2">
          <button onClick={() => setNewClaimModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
            <Plus size={14} /> Submit New Claim
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
        </div>
      }
    >
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Claims Filed</span>
          <div className="text-3xl font-black text-slate-800 dark:text-white">₹{totalClaimed.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-2">{expenses.length} claims submitted across departments</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Approved for Payout</span>
          <div className="text-3xl font-black text-emerald-600">₹{totalApproved.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-2">Processed and authorized by Management</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Sign-off</span>
          <div className="text-3xl font-black text-orange-500">₹{totalPending.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-2">Awaiting executive approval review</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Expense Reimbursement Roster</h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Employee</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Expense Item / Purpose</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Category</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Amount</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400">{e.date}</td>
                  <td className="p-4 font-extrabold text-slate-800 dark:text-white">{e.employee_name}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-white text-sm">{e.title}</div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Receipt size={12} /> {e.receipt_name}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-4 font-black text-slate-800 dark:text-white">
                    ₹{Number(e.amount).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      e.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      e.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                    }`}>
                      {e.status}
                    </span>
                    {e.manager_comment && (
                      <span className="text-[10px] text-slate-400 block mt-1 italic">"{e.manager_comment}"</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {canApprove && e.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(e.id)} 
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(e.id)} 
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => alert(`Opening receipt proof: ${e.receipt_name}`)} className="text-xs font-bold text-orange-500 hover:underline">
                        View Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW CLAIM MODAL */}
      <AnimatePresence>
        {newClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewClaimModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setNewClaimModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={20} /></button>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Submit Expense Claim</h3>
              <form onSubmit={handleSubmitClaim} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expense Title / Description</label>
                  <input required value={claimForm.title} onChange={e => setClaimForm({...claimForm, title: e.target.value})} className="input" placeholder="e.g. Avionics lab sensors purchase" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expense Category</label>
                  <select value={claimForm.category} onChange={e => setClaimForm({...claimForm, category: e.target.value})} className="input">
                    <option value="Hardware/Tools">Hardware / R&D Tools</option>
                    <option value="Software/Cloud">Software / Cloud Subscriptions</option>
                    <option value="Travel">Travel & Transportation</option>
                    <option value="Meals/Office">Client Meals / Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Claim Amount (₹ INR)</label>
                  <input required type="number" min="1" value={claimForm.amount} onChange={e => setClaimForm({...claimForm, amount: e.target.value})} className="input" placeholder="e.g. 2500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Attach Receipt / Invoice (PDF / Image)</label>
                  <input type="file" className="input text-xs" onChange={e => {
                    if (e.target.files[0]) setClaimForm({ ...claimForm, receipt_name: e.target.files[0].name });
                  }} />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Submit for Management Approval</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
