import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { CheckCircle2, Clock, XCircle, Bell, ArrowRight, ShieldCheck, FileText, Send } from 'lucide-react';

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [chains, setChains] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const canAct = currentUser?.role === 'Admin' || currentUser?.role === 'Management';

  useEffect(() => {
    setApprovals(db.getDocumentApprovals());
    setChains(db.getApprovalChains());
  }, []);

  const handleDecision = (docId, status) => {
    const updated = db.updateDocumentApprovalStatus(docId, status, currentUser?.username || 'Approver');
    setApprovals(updated);
  };

  const handleSendReminder = (doc) => {
    alert(`Automated notification reminder sent to assignees for "${doc.title}".`);
    db.logAudit(currentUser?.username || 'user', 'APPROVAL_REMINDER_SENT', 'Document', doc.id, '', `Reminder for ${doc.candidate_name}`);
  };

  return (
    <Section 
      title="Document Approvals & Chains" 
      subtitle="Configurable multi-tier sign-offs for Offer Letters, NDAs, and Certifications."
    >
      {/* Active Approval Chains Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {chains.map(c => (
          <div key={c.id} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase text-orange-500 tracking-wider">{c.id} Chain</span>
              {c.auto_remind && (
                <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Bell size={10} /> {c.reminder_days}d Reminders
                </span>
              )}
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-4">{c.document_type}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {c.stages.map((stage, i) => (
                <React.Fragment key={stage}>
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                    {stage}
                  </span>
                  {i < c.stages.length - 1 && <ArrowRight size={12} className="text-slate-400" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pending and Completed Documents */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Pending & Active Sign-Offs</h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Document / Title</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Candidate / Subject</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Current Stage</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Due Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {approvals.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                      <FileText size={16} className="text-orange-500 shrink-0" />
                      {doc.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Initiated by: {doc.requested_by}</div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                    {doc.candidate_name}
                    <div className="text-xs text-slate-400">{doc.department}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 rounded-lg">
                      {doc.current_stage}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {doc.due_date}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      doc.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleSendReminder(doc)}
                        title="Send Reminder Alert"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        <Bell size={15} />
                      </button>
                      {canAct && doc.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleDecision(doc.id, 'Approved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleDecision(doc.id, 'Rejected')}
                            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
