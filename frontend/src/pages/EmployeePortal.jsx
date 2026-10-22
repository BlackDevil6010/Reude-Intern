import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { 
  User, FileText, Calendar, CheckSquare, Network, MessageSquare, 
  Bell, Receipt, Clock, CheckCircle2, AlertCircle, ArrowUpRight, 
  Upload, Download, ShieldCheck, Sparkles, Building2, Phone, Mail, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeePortal() {
  const [activeTab, setActiveTab] = useState('profile');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  
  // Find employee profile corresponding to logged in user
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [onboarding, setOnboarding] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [hrRequests, setHrRequests] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  // Modals / forms
  const [profileModal, setProfileModal] = useState(false);
  const [changeReq, setChangeReq] = useState({ field: 'emergency_contact_number', requested_value: '', reason: '' });
  const [leaveModal, setLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'Casual Leave', start_date: '', end_date: '', days: 1, reason: '' });
  const [requestModal, setRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ type: 'Bonafide Certificate', purpose: '' });
  const [docUploadModal, setDocUploadModal] = useState(false);
  const [uploadDoc, setUploadDoc] = useState({ title: '', category: 'ID Proof' });

  const loadData = () => {
    const emps = db.getEmployees();
    setAllEmployees(emps);
    // Find matching employee by user ID or first name
    const found = emps.find(e => 
      String(e.id) === String(currentUser?.id) || 
      String(e.user_id) === String(currentUser?.id) ||
      e.first_name.toLowerCase() === (currentUser?.username || '').toLowerCase()
    ) || emps[0];
    
    setEmployee(found);
    if (found) {
      setDocuments(db.getEmployeeDocuments(found.user_id || found.id));
      setOnboarding(db.getOnboardingTasks(found.user_id || found.id));
      setLeaves(db.getLeaves(found.user_id || found.id));
      setHrRequests(db.getHRRequests(found.user_id || found.id));
      setPayslips(db.getPayslips(found.user_id || found.id));
      setNotifications(db.getNotifications(found.user_id || found.id));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSignDoc = (docId) => {
    db.signDocument(docId, employee?.first_name || 'Employee');
    loadData();
    alert('Document successfully signed with digital audit record.');
  };

  const handleUploadProof = (e) => {
    e.preventDefault();
    if (!uploadDoc.title) return;
    db.uploadDocumentProof({
      user_id: employee?.user_id || employee?.id,
      title: uploadDoc.title,
      category: uploadDoc.category,
      status: 'Uploaded (Pending HR Verify)',
      url: '#'
    }, employee?.first_name || 'Employee');
    setDocUploadModal(false);
    setUploadDoc({ title: '', category: 'ID Proof' });
    loadData();
  };

  const handleToggleTask = (taskId) => {
    db.toggleOnboardingTask(taskId, employee?.first_name || 'Employee');
    loadData();
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    db.applyLeave({
      user_id: employee?.user_id || employee?.id,
      employee_name: `${employee?.first_name} ${employee?.last_name}`,
      type: newLeave.type,
      start_date: newLeave.start_date,
      end_date: newLeave.end_date,
      days: Number(newLeave.days),
      reason: newLeave.reason
    }, employee?.first_name || 'Employee');
    setLeaveModal(false);
    setNewLeave({ type: 'Casual Leave', start_date: '', end_date: '', days: 1, reason: '' });
    loadData();
  };

  const handleCancelLeave = (leaveId) => {
    db.cancelLeave(leaveId, employee?.first_name || 'Employee');
    loadData();
  };

  const handleSubmitProfileRequest = (e) => {
    e.preventDefault();
    db.submitProfileRequest({
      user_id: employee?.user_id || employee?.id,
      employee_name: `${employee?.first_name} ${employee?.last_name}`,
      field: changeReq.field,
      current_value: employee?.[changeReq.field] || '—',
      requested_value: changeReq.requested_value,
      reason: changeReq.reason
    }, employee?.first_name || 'Employee');
    setProfileModal(false);
    setChangeReq({ field: 'emergency_contact_number', requested_value: '', reason: '' });
    alert('Change request submitted to HR for sign-off.');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    db.submitHRRequest({
      user_id: employee?.user_id || employee?.id,
      employee_name: `${employee?.first_name} ${employee?.last_name}`,
      type: newRequest.type,
      purpose: newRequest.purpose
    }, employee?.first_name || 'Employee');
    setRequestModal(false);
    setNewRequest({ type: 'Bonafide Certificate', purpose: '' });
    loadData();
  };

  // Onboarding progress
  const completedOnboarding = onboarding.filter(t => t.status === 'Completed').length;
  const onboardingPct = onboarding.length > 0 ? Math.round((completedOnboarding / onboarding.length) * 100) : 100;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'documents', label: 'My Documents', icon: FileText, badge: documents.filter(d => d.status === 'Pending Signature').length },
    { id: 'onboarding', label: 'Onboarding Checklist', icon: CheckSquare, badge: `${onboardingPct}%` },
    { id: 'leave', label: 'Leave Portal', icon: Calendar },
    { id: 'directory', label: 'Directory & Org Chart', icon: Network },
    { id: 'requests', label: 'HR Requests', icon: MessageSquare },
    { id: 'payslips', label: 'Payslips', icon: Receipt },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length }
  ];

  return (
    <Section 
      title={`Employee Self-Service Desk · ${employee ? employee.first_name : 'Portal'}`}
      subtitle="View your personal record, complete digital signings, manage leaves, and track requests."
    >
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-reude text-white shadow-md shadow-orange-500/20'
                  : 'bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                }`}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 1. MY PROFILE */}
      {activeTab === 'profile' && employee && (
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-reude text-white text-2xl font-black flex items-center justify-center shadow-lg shadow-orange-500/25">
                  {employee.first_name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">{employee.first_name} {employee.last_name}</h3>
                  <p className="text-slate-500 text-sm">{employee.designation} · {employee.department}</p>
                  <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                    ID: {employee.employee_id}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setProfileModal(true)} 
                className="btn-primary flex items-center gap-2 text-xs"
              >
                Request Profile Update
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Personal Details</span>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-400">Gender:</span> <strong>{employee.gender || '—'}</strong></div>
                  <div><span className="text-slate-400">Date of Birth:</span> <strong>{employee.date_of_birth || '—'}</strong></div>
                  <div><span className="text-slate-400">Personal Email:</span> <strong>{employee.personal_email || '—'}</strong></div>
                  <div><span className="text-slate-400">Mobile:</span> <strong>{employee.mobile_number || '—'}</strong></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Emergency Contact</span>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-400">Name:</span> <strong>{employee.emergency_contact_name || '—'}</strong></div>
                  <div><span className="text-slate-400">Relationship:</span> <strong>{employee.emergency_contact_relationship || '—'}</strong></div>
                  <div><span className="text-slate-400">Contact Number:</span> <strong>{employee.emergency_contact_number || '—'}</strong></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Employment & Address</span>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-400">Location:</span> <strong>{employee.work_location || employee.city || 'Chennai'}</strong></div>
                  <div><span className="text-slate-400">Joined:</span> <strong>{employee.joining_date || '—'}</strong></div>
                  <div><span className="text-slate-400">Reporting Line:</span> <strong className="text-xs break-all">{employee.reporting_manager_id || 'Director'}</strong></div>
                  <div><span className="text-slate-400">City / State:</span> <strong>{employee.city}, {employee.state}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Offer Letters, NDAs & ID Proofs</h3>
              <p className="text-slate-500 text-sm">Encrypted storage (Supabase Private Bucket) with secure signed URL access.</p>
            </div>
            <button onClick={() => setDocUploadModal(true)} className="btn-primary flex items-center gap-2 text-xs">
              <Upload size={14} /> Upload ID Proof
            </button>
          </div>

          <div className="space-y-4">
            {documents.map(d => (
              <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-base">{d.title}</h4>
                    <p className="text-xs text-slate-400">Category: {d.category} · Storage: {d.storage}</p>
                    {d.signed_at && <span className="text-[11px] text-emerald-600 font-semibold">Signed on {d.signed_at}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    d.status === 'Signed' || d.status === 'Verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                  }`}>
                    {d.status}
                  </span>

                  {d.status === 'Pending Signature' ? (
                    <button onClick={() => handleSignDoc(d.id)} className="btn-primary text-xs py-2">
                      Sign Document Now
                    </button>
                  ) : (
                    <button onClick={() => alert('Opening signed URL preview from private bucket...')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold">
                      View Document
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ONBOARDING CHECKLIST */}
      {activeTab === 'onboarding' && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Onboarding Milestones</h3>
              <p className="text-slate-500 text-sm">Assigned from company onboarding templates.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-orange-500">{onboardingPct}%</span>
              <span className="text-xs text-slate-400 block font-semibold">{completedOnboarding} of {onboarding.length} done</span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-reude rounded-full transition-all duration-500" style={{ width: `${onboardingPct}%` }} />
          </div>

          <div className="space-y-3">
            {onboarding.map(t => (
              <div 
                key={t.id}
                onClick={() => handleToggleTask(t.id)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between cursor-pointer hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    t.status === 'Completed' ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600'
                  }`}>
                    {t.status === 'Completed' && <CheckCircle2 size={16} />}
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>{t.title}</h5>
                    <span className="text-xs text-slate-400">{t.template} · Due: {t.due_date}</span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  t.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LEAVE PORTAL */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/10 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Casual Leave Available</span>
              <div className="text-3xl font-black text-slate-800 dark:text-white mt-2">8 <span className="text-base text-slate-400">days</span></div>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/10 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Sick Leave Available</span>
              <div className="text-3xl font-black text-slate-800 dark:text-white mt-2">6 <span className="text-base text-slate-400">days</span></div>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/10 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Privilege Leave</span>
              <div className="text-3xl font-black text-slate-800 dark:text-white mt-2">12 <span className="text-base text-slate-400">days</span></div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Leave History & Applications</h3>
              <button onClick={() => setLeaveModal(true)} className="btn-primary text-xs">
                Apply for Leave
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Dates</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {leaves.map(l => (
                    <tr key={l.id}>
                      <td className="p-4 font-bold text-slate-800 dark:text-white">{l.type}</td>
                      <td className="p-4 text-xs font-mono">{l.start_date} to {l.end_date}</td>
                      <td className="p-4 font-semibold">{l.days} Day(s)</td>
                      <td className="p-4 text-slate-500 text-xs">{l.reason}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                          l.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {l.status === 'Pending' && (
                          <button onClick={() => handleCancelLeave(l.id)} className="text-xs text-rose-500 font-bold hover:underline">
                            Cancel Request
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. DIRECTORY & ORG CHART */}
      {activeTab === 'directory' && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Company Directory & Reporting Line</h3>
          <p className="text-slate-500 text-sm mb-6">Safe colleague directory with public fields only.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEmployees.map(emp => (
              <div key={emp.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-400 to-reude text-white font-black flex items-center justify-center text-lg shadow-md">
                    {emp.first_name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white text-base">{emp.first_name} {emp.last_name}</h4>
                    <p className="text-xs text-slate-400">{emp.designation}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2"><Building2 size={12} className="text-orange-500"/> {emp.department}</div>
                  <div className="flex items-center gap-2"><Mail size={12} className="text-orange-500"/> {emp.work_email}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-orange-500"/> {emp.work_location || 'Chennai Hub'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. HR REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">HR Letters & Service Requests</h3>
              <p className="text-slate-500 text-sm">Request bonafide, visa, and employment verification certificates.</p>
            </div>
            <button onClick={() => setRequestModal(true)} className="btn-primary text-xs">
              New Letter Request
            </button>
          </div>

          <div className="space-y-3">
            {hrRequests.map(r => (
              <div key={r.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-base">{r.type}</h4>
                  <p className="text-xs text-slate-400">Purpose: {r.purpose} · Requested: {r.requested_on}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  r.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PAYSLIPS */}
      {activeTab === 'payslips' && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Confidential Payslips</h3>
          <p className="text-slate-500 text-sm mb-6">Protected earnings and deduction statements.</p>

          <div className="space-y-4">
            {payslips.map(p => (
              <div key={p.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-lg">{p.month}</h4>
                  <p className="text-xs text-slate-400">Disbursed on {p.paid_date} via Direct Bank Deposit</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span>Basic: ₹{p.basic.toLocaleString()}</span>
                    <span>HRA: ₹{p.hra.toLocaleString()}</span>
                    <span>Deductions: ₹{p.deductions.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Net Pay</span>
                    <span className="text-2xl font-black text-emerald-600">₹{p.net.toLocaleString()}</span>
                  </div>
                  <button onClick={() => alert(`Downloading signed PDF payslip for ${p.month}...`)} className="btn-primary text-xs py-2.5">
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">System & Email Alerts</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-2xl border ${n.read ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-white/5' : 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-500/20'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h5>
                  <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE UPDATE MODAL */}
      <AnimatePresence>
        {profileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Request Profile Change</h3>
              <p className="text-slate-500 text-xs mb-4">Requires HR approval before reflecting in official records.</p>
              <form onSubmit={handleSubmitProfileRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Field to Update</label>
                  <select value={changeReq.field} onChange={e => setChangeReq({...changeReq, field: e.target.value})} className="input">
                    <option value="emergency_contact_number">Emergency Contact Number</option>
                    <option value="emergency_contact_name">Emergency Contact Name</option>
                    <option value="mobile_number">Mobile Number</option>
                    <option value="personal_email">Personal Email</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">New Value</label>
                  <input required value={changeReq.requested_value} onChange={e => setChangeReq({...changeReq, requested_value: e.target.value})} className="input" placeholder="e.g. 9884012345" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Reason for Change</label>
                  <input required value={changeReq.reason} onChange={e => setChangeReq({...changeReq, reason: e.target.value})} className="input" placeholder="e.g. New primary contact" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Submit for HR Approval</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEAVE APPLICATION MODAL */}
      <AnimatePresence>
        {leaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLeaveModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Apply for Leave</h3>
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Leave Type</label>
                  <select value={newLeave.type} onChange={e => setNewLeave({...newLeave, type: e.target.value})} className="input">
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Privilege Leave">Privilege Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Start Date</label>
                    <input required type="date" value={newLeave.start_date} onChange={e => setNewLeave({...newLeave, start_date: e.target.value})} className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">End Date</label>
                    <input required type="date" value={newLeave.end_date} onChange={e => setNewLeave({...newLeave, end_date: e.target.value})} className="input" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Days Count</label>
                  <input required type="number" min="1" value={newLeave.days} onChange={e => setNewLeave({...newLeave, days: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Reason</label>
                  <input required value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} className="input" placeholder="e.g. Attending family wedding" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Submit Leave Request</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HR LETTER REQUEST MODAL */}
      <AnimatePresence>
        {requestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Request HR Certificate</h3>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Certificate Type</label>
                  <select value={newRequest.type} onChange={e => setNewRequest({...newRequest, type: e.target.value})} className="input">
                    <option value="Bonafide Certificate">Bonafide Certificate</option>
                    <option value="Employment Verification Letter">Employment Verification Letter</option>
                    <option value="Salary Certificate">Salary Certificate</option>
                    <option value="Address Proof Letter">Address Proof Letter</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Purpose</label>
                  <input required value={newRequest.purpose} onChange={e => setNewRequest({...newRequest, purpose: e.target.value})} className="input" placeholder="e.g. Passport renewal / Bank verification" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Submit Request</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ID PROOF UPLOAD MODAL */}
      <AnimatePresence>
        {docUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDocUploadModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Upload ID Proof</h3>
              <form onSubmit={handleUploadProof} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Document Title</label>
                  <input required value={uploadDoc.title} onChange={e => setUploadDoc({...uploadDoc, title: e.target.value})} className="input" placeholder="e.g. Government Aadhaar / Passport Scan" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Storage Destination</label>
                  <input readOnly value="Supabase Storage (Private Encrypted Bucket)" className="input text-xs text-slate-400 bg-slate-100" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Save & Upload Proof</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
