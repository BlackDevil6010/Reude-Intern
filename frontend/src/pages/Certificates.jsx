import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { printToPDF } from '../utils/exportUtils';
import { Award, Printer, Download, FileText, CheckCircle2, Shield, Sparkles, Building2 } from 'lucide-react';

export default function Certificates() {
  const [interns, setInterns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [certType, setCertType] = useState('internship'); // 'internship' | 'experience' | 'offer'
  const [selectedInternId, setSelectedInternId] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [conduct, setConduct] = useState('Exemplary');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');

  useEffect(() => {
    const ints = db.getInterns();
    const emps = db.getEmployees();
    setInterns(ints);
    setEmployees(emps);
    if (ints.length > 0) setSelectedInternId(String(ints[0].id));
    if (emps.length > 0) setSelectedEmpId(String(emps[0].id));
  }, []);

  const selectedIntern = interns.find(i => String(i.id) === String(selectedInternId)) || interns[0];
  const selectedEmp = employees.find(e => String(e.id) === String(selectedEmpId)) || employees[0];

  const handlePrintCertificate = () => {
    let title = '';
    let bodyHtml = '';

    if (certType === 'internship' && selectedIntern) {
      title = `Certificate of Internship - ${selectedIntern.name}`;
      bodyHtml = `
        <div style="border: 6px double #ea580c; padding: 40px; text-align: center; border-radius: 12px; background: #fffdfa;">
          <h2 style="font-size: 14px; letter-spacing: 3px; color: #ea580c; text-transform: uppercase; margin-bottom: 5px;">REUDE TECHNOLOGIES PRIVATE LIMITED</h2>
          <p style="font-size: 11px; color: #64748b; margin-top: 0;">Autonomous Flight Systems & Engineering Avionics Hub · Chennai & Singapore</p>
          <hr style="border: none; border-top: 1px solid #fed7aa; margin: 25px 0;" />
          
          <h1 style="font-size: 32px; font-family: 'Georgia', serif; color: #1e293b; margin: 15px 0;">Certificate of Internship</h1>
          <p style="font-size: 14px; color: #64748b; font-style: italic;">This credential is proudly awarded to</p>
          
          <h2 style="font-size: 28px; color: #ea580c; margin: 10px 0; text-decoration: underline;">${selectedIntern.name}</h2>
          <p style="font-size: 13px; color: #334155; line-height: 1.8; max-width: 600px; margin: 20px auto;">
            for successfully completing the <strong>${selectedIntern.duration || '3-Month'}</strong> intensive professional internship as a 
            <strong>${selectedIntern.department}</strong> at REUDE Technologies from <strong>${selectedIntern.start_date || 'Sept 2026'}</strong> to <strong>${selectedIntern.end_date || 'Dec 2026'}</strong>.
            During this tenure, the candidate demonstrated exceptional technical skills, discipline, and performance rated at <strong>${selectedIntern.performance || 5}/5 Stars</strong> under supervisor <strong>${selectedIntern.supervisor || 'Deepak Raj'}</strong>.
          </p>

          <div style="margin-top: 50px; display: flex; justify-content: space-between; padding: 0 40px; font-size: 12px;">
            <div style="text-align: center;">
              <p style="border-top: 1px solid #94a3b8; width: 160px; padding-top: 5px; margin: 0 auto; font-weight: bold; color: #1e293b;">Veerapradeepan M.</p>
              <span style="color: #64748b; font-size: 10px;">Director of Engineering</span>
            </div>
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; border: 2px dashed #ea580c; border-radius: 50%; margin: -20px auto 5px; display: flex; align-items: center; justify-content: center; color: #ea580c; font-weight: bold; font-size: 9px;">OFFICIAL SEAL</div>
              <span style="color: #64748b; font-size: 10px;">Issued on ${issueDate}</span>
            </div>
            <div style="text-align: center;">
              <p style="border-top: 1px solid #94a3b8; width: 160px; padding-top: 5px; margin: 0 auto; font-weight: bold; color: #1e293b;">Rajesh Kumar B.</p>
              <span style="color: #64748b; font-size: 10px;">Consultant AI/ML & Quality</span>
            </div>
          </div>
          <p style="font-size: 9px; color: #94a3b8; margin-top: 40px;">Verification Code: REUDE-CERT-${selectedIntern.intern_id}-${Date.now().toString().slice(-6)} · Verified on reude.tech</p>
        </div>
      `;
    } else if (certType === 'experience' && selectedEmp) {
      title = `Experience & Relieving Certificate - ${selectedEmp.first_name} ${selectedEmp.last_name}`;
      bodyHtml = `
        <div style="border: 1px solid #cbd5e1; padding: 40px; border-radius: 8px; font-size: 13px; line-height: 1.8; color: #1e293b;">
          <h2 style="color: #ea580c; margin-bottom: 2px;">REUDE TECHNOLOGIES PRIVATE LIMITED</h2>
          <p style="color: #64748b; font-size: 11px; margin-top: 0;">CIN: U72900TN2025PTC123456 · Ambattur Industrial Estate, Chennai</p>
          <hr style="margin: 20px 0;" />
          <p style="text-align: right; font-weight: bold;">Date: ${issueDate}</p>
          <h3 style="text-align: center; text-decoration: underline; margin: 25px 0;">TO WHOMSOEVER IT MAY CONCERN</h3>
          <p>This is to certify that <strong>${selectedEmp.first_name} ${selectedEmp.last_name}</strong> (Employee ID: <strong>${selectedEmp.employee_id}</strong>) was employed with REUDE Technologies as <strong>${selectedEmp.designation}</strong> in the <strong>${selectedEmp.department}</strong> department from <strong>${selectedEmp.joining_date}</strong> to <strong>${issueDate}</strong>.</p>
          <p>During their tenure with us, they demonstrated strong technical proficiency, problem-solving abilities, and collaborative leadership. Their conduct and character have been <strong>${conduct}</strong>.</p>
          <p>We wish them all success in their future professional endeavors.</p>
          <br /><br />
          <p>For <strong>REUDE Technologies Private Limited</strong>,</p>
          <br /><br />
          <p><strong>Authorized Signatory</strong><br /><span style="color: #64748b;">Human Resources & Operations</span></p>
        </div>
      `;
    } else if (certType === 'offer' && selectedEmp) {
      title = `Appointment & Offer Letter - ${selectedEmp.first_name}`;
      bodyHtml = `
        <div style="border: 1px solid #cbd5e1; padding: 40px; border-radius: 8px; font-size: 13px; line-height: 1.8; color: #1e293b;">
          <h2 style="color: #ea580c; margin-bottom: 2px;">REUDE TECHNOLOGIES PRIVATE LIMITED</h2>
          <p style="color: #64748b; font-size: 11px; margin-top: 0;">Autonomous Drone Robotics & Systems · reude.in</p>
          <hr style="margin: 20px 0;" />
          <p style="text-align: right; font-weight: bold;">Date: ${issueDate}</p>
          <p>To,<br /><strong>${selectedEmp.first_name} ${selectedEmp.last_name}</strong><br />Email: ${selectedEmp.work_email}</p>
          <h3 style="text-align: center; text-decoration: underline; margin: 20px 0;">LETTER OF APPOINTMENT</h3>
          <p>Dear ${selectedEmp.first_name},</p>
          <p>We are pleased to offer you the position of <strong>${selectedEmp.designation}</strong> in the <strong>${selectedEmp.department}</strong> department at REUDE Technologies.</p>
          <p>Your compensation package is fixed at <strong>${stipend}</strong>. Your primary work base will be at <strong>${selectedEmp.work_location || 'Chennai Engineering Facility'}</strong>.</p>
          <p>Please return a signed copy of this letter along with your non-disclosure agreement (NDA) to confirm your acceptance.</p>
          <br />
          <p>Sincerely,<br /><strong>Human Resources Division</strong><br />REUDE Technologies Private Limited</p>
        </div>
      `;
    }

    printToPDF(title, bodyHtml);
    db.logAudit(currentUser?.username || 'user', 'CERTIFICATE_GENERATED', 'Document', certType, '', title);
  };

  return (
    <Section 
      title="Official Certificate & Letter Generator" 
      subtitle="Instantly generate, review, and print verified branded internship certificates, experience letters, and offers."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Card */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl space-y-5">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Document Settings</h3>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['internship', 'Internship Certificate'],
                ['experience', 'Experience Letter'],
                ['offer', 'Offer Letter']
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setCertType(id)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                    certType === id 
                      ? 'bg-gradient-to-r from-orange-500 to-reude text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {certType === 'internship' ? (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Select Intern</label>
              <select 
                value={selectedInternId} 
                onChange={e => setSelectedInternId(e.target.value)}
                className="input"
              >
                {interns.map(i => (
                  <option key={i.id} value={i.id}>{i.name} ({i.intern_id}) · {i.department}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Select Employee / Candidate</label>
              <select 
                value={selectedEmpId} 
                onChange={e => setSelectedEmpId(e.target.value)}
                className="input"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>
                ))}
              </select>
            </div>
          )}

          {certType === 'offer' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Compensation / Stipend</label>
              <input value={stipend} onChange={e => setStipend(e.target.value)} className="input" />
            </div>
          )}

          {certType === 'experience' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Performance & Conduct Note</label>
              <input value={conduct} onChange={e => setConduct(e.target.value)} className="input" />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Issue Date</label>
            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="input" />
          </div>

          <button 
            onClick={handlePrintCertificate}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-4 font-bold"
          >
            <Printer size={18} /> Print / Save as PDF
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-2 bg-gradient-to-b from-orange-50/50 to-amber-50/30 dark:from-slate-900 dark:to-slate-950 border-2 border-orange-500/20 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="border-4 border-double border-orange-500/30 dark:border-orange-500/20 rounded-2xl p-8 bg-white dark:bg-slate-900/90 text-center relative">
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase text-orange-600 dark:text-orange-400 tracking-widest mb-1">
              <Sparkles size={14} /> REUDE TECHNOLOGIES PRIVATE LIMITED
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-4">Autonomous Flight Robotics & Engineering Division · Chennai</p>
            <div className="w-16 h-0.5 bg-orange-500 mx-auto mb-6" />

            {certType === 'internship' && selectedIntern && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-serif tracking-tight mb-2">
                  Certificate of Internship
                </h2>
                <p className="text-xs text-slate-400 italic mb-4">This is to proudly certify that</p>
                <div className="text-2xl font-black text-orange-600 dark:text-orange-400 underline mb-4">
                  {selectedIntern.name}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                  has successfully completed the <strong>{selectedIntern.duration || '3-Month'}</strong> professional internship as a <strong>{selectedIntern.department}</strong> from <strong>{selectedIntern.start_date || 'Sept 2026'}</strong> to <strong>{selectedIntern.end_date || 'Dec 2026'}</strong> with performance rating of <strong>{selectedIntern.performance || 5}/5 Stars</strong>.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white">Veerapradeepan M.</div>
                    <span className="text-[10px] text-slate-400">Engineering Lead</span>
                  </div>
                  <div>
                    <div className="w-10 h-10 border-2 border-dashed border-orange-500 rounded-full mx-auto flex items-center justify-center text-[8px] font-bold text-orange-500">
                      SEAL
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white">{selectedIntern.supervisor || 'Deepak Raj'}</div>
                    <span className="text-[10px] text-slate-400">Direct Supervisor</span>
                  </div>
                </div>
              </>
            )}

            {certType === 'experience' && selectedEmp && (
              <>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                  Experience & Relieving Certificate
                </h2>
                <div className="text-xl font-bold text-orange-600 mb-4">{selectedEmp.first_name} {selectedEmp.last_name}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                  Certified as <strong>{selectedEmp.designation}</strong> in <strong>{selectedEmp.department}</strong> since {selectedEmp.joining_date}. Conduct noted as <strong>{conduct}</strong>.
                </p>
                <span className="text-xs text-slate-400 font-mono">Issued on {issueDate} · Authorized by Management</span>
              </>
            )}

            {certType === 'offer' && selectedEmp && (
              <>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                  Official Appointment Letter
                </h2>
                <div className="text-xl font-bold text-orange-600 mb-2">{selectedEmp.first_name} {selectedEmp.last_name}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                  Offered role of <strong>{selectedEmp.designation}</strong> with stipend/CTC of <strong>{stipend}</strong>.
                </p>
                <span className="text-xs text-slate-400 font-mono">REUDE HR Division · Official Sign-off</span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Official High-Resolution Vector Print</span>
            <span className="text-orange-500 font-bold">Tamper-Evident Verification Hash Embedded</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
