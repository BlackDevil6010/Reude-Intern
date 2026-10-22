import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { 
  Building2, FileText, Mail, Bell, Shield, 
  Save, Check, ExternalLink, Sliders
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState(db.getSettings());
  const [savedNotice, setSavedNotice] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    setSettings(db.getSettings());
  }, []);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    const updated = db.updateSettings(settings, currentUser?.username || 'admin');
    setSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleToggleRule = (key) => {
    if (!isAdmin) return;
    const rules = { ...settings.notification_rules, [key]: !settings.notification_rules?.[key] };
    const updated = db.updateSettings({ notification_rules: rules }, currentUser?.username || 'admin');
    setSettings(updated);
  };

  return (
    <Section 
      title="System Settings & Governance" 
      subtitle="Manage company profile, document templates, email automations, and notification rules."
      action={
        savedNotice ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold text-sm">
            <Check size={16} /> Saved to Audit Log
          </div>
        ) : null
      }
    >
      <div className="space-y-8">
        {/* Company Profile */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Company Profile & Branding</h3>
              <p className="text-xs text-slate-400">Enterprise identification used across documents and emails</p>
            </div>
          </div>

          <form onSubmit={handleSaveCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Company Legal Entity</label>
              <input 
                disabled={!isAdmin}
                value={settings.company_name || ''} 
                onChange={e => setSettings({...settings, company_name: e.target.value})} 
                className="input" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Portal Display Title</label>
              <input 
                disabled={!isAdmin}
                value={settings.portal_title || ''} 
                onChange={e => setSettings({...settings, portal_title: e.target.value})} 
                className="input" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Official Website Link</label>
              <input 
                disabled={!isAdmin}
                value={settings.official_website || ''} 
                onChange={e => setSettings({...settings, official_website: e.target.value})} 
                className="input" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Support Email</label>
              <input 
                disabled={!isAdmin}
                value={settings.support_email || ''} 
                onChange={e => setSettings({...settings, support_email: e.target.value})} 
                className="input" 
              />
            </div>
            {isAdmin && (
              <div className="md:col-span-2 mt-2">
                <button type="submit" className="btn-primary">
                  Save Company Profile
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Document Templates & Email Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Templates */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Document Templates</h3>
                <p className="text-xs text-slate-400">Standard templates for contracts, letters & certificates</p>
              </div>
            </div>

            <div className="space-y-3">
              {(settings.document_templates || []).map(t => (
                <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.name}</h4>
                    <span className="text-xs text-slate-400">Category: {t.category} · Updated: {t.last_updated}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Email Notification Templates</h3>
                <p className="text-xs text-slate-400">Automated outbound communication dispatches</p>
              </div>
            </div>

            <div className="space-y-3">
              {(settings.email_templates || []).map(t => (
                <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Subject: <em>{t.subject}</em></p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Rules */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Notification & Dispatch Rules</h3>
              <p className="text-xs text-slate-400">Trigger email and in-app alerts on mission-critical workflow events</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white">Email on Task Assignment</h5>
                <p className="text-xs text-slate-400">Notify employee when task is created</p>
              </div>
              <input 
                type="checkbox" 
                disabled={!isAdmin}
                checked={!!settings.notification_rules?.email_on_task_assign}
                onChange={() => handleToggleRule('email_on_task_assign')}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white">Email on Leave Decision</h5>
                <p className="text-xs text-slate-400">Notify employee on approval/rejection</p>
              </div>
              <input 
                type="checkbox" 
                disabled={!isAdmin}
                checked={!!settings.notification_rules?.email_on_leave_decision}
                onChange={() => handleToggleRule('email_on_leave_decision')}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white">Email on Document Sign</h5>
                <p className="text-xs text-slate-400">Alert HR when NDA or offer is signed</p>
              </div>
              <input 
                type="checkbox" 
                disabled={!isAdmin}
                checked={!!settings.notification_rules?.email_on_doc_sign}
                onChange={() => handleToggleRule('email_on_doc_sign')}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
