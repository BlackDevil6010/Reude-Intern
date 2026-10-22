import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { 
  Users, GraduationCap, CheckCircle2, Clock, 
  TrendingUp, Award, ExternalLink, ShieldCheck, CheckSquare,
  BarChart3, Sparkles, Calendar, FileText, Check, X
} from 'lucide-react';
import { exportToCSV, printToPDF } from '../utils/exportUtils';

export default function Management() {
  const [employees, setEmployees] = useState([]);
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  const loadData = () => {
    setEmployees(db.getEmployees());
    setInterns(db.getInterns());
    setTasks(db.getTasks());
    setCandidates(db.getCandidates());
    setLeaves(db.getLeaves());
    setApprovals(db.getDocumentApprovals());
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalHeadcount = employees.length + interns.length;
  const activeEmployees = employees.filter(e => e.employment_status === 'Active' || e.employment_status === 'Permanent').length;
  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  // Pipeline stage groupings
  const pipelineByStage = candidates.reduce((acc, c) => {
    const stg = c.stage || 'Applied';
    acc[stg] = (acc[stg] || 0) + 1;
    return acc;
  }, {});

  const handleApproveLeave = (leaveId) => {
    db.updateLeaveStatus(leaveId, 'Approved', 'Approved by Management', currentUser?.username || 'management');
    loadData();
  };

  const handleRejectLeave = (leaveId) => {
    db.updateLeaveStatus(leaveId, 'Rejected', 'Rejected by Management', currentUser?.username || 'management');
    loadData();
  };

  const handleApproveDoc = (docId) => {
    db.updateDocumentApprovalStatus(docId, 'Approved', currentUser?.username || 'management');
    loadData();
  };

  const handleExportExecutiveReport = () => {
    const reportData = employees.map(e => ({
      ID: e.employee_id,
      Name: `${e.first_name} ${e.last_name}`,
      Department: e.department,
      Designation: e.designation,
      Status: e.employment_status
    }));
    exportToCSV(`reude_executive_summary_${new Date().toISOString().slice(0, 10)}`, reportData);
    db.logAudit(currentUser?.username || 'management', 'EXECUTIVE_REPORT_EXPORT', 'Report', 'Headcount', '', 'CSV Exported');
  };

  return (
    <Section 
      title="Management Executive Intelligence Desk" 
      subtitle="Headcount, candidate pipelines, approvals, leave oversight, and executive reports (read-mostly governance)."
      action={
        <div className="flex gap-3">
          <button onClick={handleExportExecutiveReport} className="btn-primary flex items-center gap-2 text-xs">
            Download Executive Report
          </button>
          <a 
            href="https://recrulyn.reude.tech/" 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Sparkles size={14} /> Open Recrulyn AI HR <ExternalLink size={12} />
          </a>
        </div>
      }
    >
      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Headcount</span>
          <div className="text-3xl font-black text-slate-800 dark:text-white">{totalHeadcount}</div>
          <p className="text-xs text-slate-500 mt-2">{activeEmployees} Full-time · {interns.length} Active Interns</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Pipeline</span>
          <div className="text-3xl font-black text-slate-800 dark:text-white">{candidates.length}</div>
          <p className="text-xs text-slate-500 mt-2">Candidates across all recruitment stages</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Approvals</span>
          <div className="text-3xl font-black text-orange-500">{pendingApprovals}</div>
          <p className="text-xs text-slate-500 mt-2">Offer letters & agreements requiring sign-off</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Leaves</span>
          <div className="text-3xl font-black text-blue-500">{pendingLeaves}</div>
          <p className="text-xs text-slate-500 mt-2">Staff leave requests awaiting review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Candidate Pipeline by Stage */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Talent Pipeline by Stage</h3>
          <p className="text-slate-500 text-xs mb-6">Real-time candidate tracking from screening to offer acceptance</p>

          <div className="space-y-4">
            {Object.entries(pipelineByStage).map(([stage, count]) => (
              <div key={stage} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{stage}</span>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  {count} Candidate{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Intern Status Summary */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Intern Status & Supervision</h3>
          <p className="text-slate-500 text-xs mb-6">Progress, duration and ratings under active supervisors</p>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {interns.map(i => (
              <div key={i.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-800 dark:text-white">{i.name}</div>
                  <span className="text-slate-400">Supervisor: {i.supervisor || 'Deepak Raj'}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-500 block">★ {i.performance || 0}/5</span>
                  <span className="text-[10px] text-slate-400">{i.duration} · {i.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Approvals for Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Sign-offs */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Pending Document Approvals</h3>
          <p className="text-slate-500 text-xs mb-6">Management sign-offs on agreements & offers</p>

          <div className="space-y-3">
            {approvals.filter(a => a.status === 'Pending').map(doc => (
              <div key={doc.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">{doc.title}</h5>
                  <span className="text-xs text-slate-400">{doc.candidate_name} · Stage: {doc.current_stage}</span>
                </div>
                <button onClick={() => handleApproveDoc(doc.id)} className="btn-primary text-xs py-2">
                  Sign Off
                </button>
              </div>
            ))}
            {approvals.filter(a => a.status === 'Pending').length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">No pending document sign-offs.</div>
            )}
          </div>
        </div>

        {/* Leave Requests Approvals */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Pending Staff Leaves</h3>
          <p className="text-slate-500 text-xs mb-6">Review & approve employee leave applications</p>

          <div className="space-y-3">
            {leaves.filter(l => l.status === 'Pending').map(leave => (
              <div key={leave.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">{leave.employee_name}</h5>
                  <span className="text-xs text-slate-400">{leave.type} ({leave.days}d) · {leave.start_date} to {leave.end_date}</span>
                  <p className="text-xs text-slate-500 mt-1 italic">"{leave.reason}"</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApproveLeave(leave.id)} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600">
                    Approve
                  </button>
                  <button onClick={() => handleRejectLeave(leave.id)} className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600">
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {leaves.filter(l => l.status === 'Pending').length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">No pending staff leave applications.</div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
