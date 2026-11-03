import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { exportToCSV } from '../utils/exportUtils';
import { 
  Laptop, HardDrive, Plus, CheckCircle2, AlertCircle, 
  Download, UserCheck, Shield, Tag, Search, Filter, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newAssetModal, setNewAssetModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('reude_user') || '{}');
  const role = currentUser?.role || 'Employee';
  const canManage = role === 'Admin' || role === 'Management';

  const [assetForm, setAssetForm] = useState({ name: '', category: 'Laptop / Workstation', serial: '', department: 'Engineering', condition: 'Excellent' });

  const loadData = () => {
    setAssets(db.getAssets());
    setEmployees(db.getEmployees());
    setInterns(db.getInterns());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAsset = (e) => {
    e.preventDefault();
    db.addAsset({
      ...assetForm,
      assigned_to: 'Unassigned (Lab Stock)',
      assigned_date: null,
      status: 'In Lab Stock'
    }, currentUser?.username || 'admin');
    setNewAssetModal(false);
    setAssetForm({ name: '', category: 'Laptop / Workstation', serial: '', department: 'Engineering', condition: 'Excellent' });
    loadData();
  };

  const handleAssignAsset = (e) => {
    e.preventDefault();
    if (!assignModal || !selectedAssignee) return;
    db.updateAsset(assignModal.id, {
      assigned_to: selectedAssignee,
      assigned_date: new Date().toISOString().split('T')[0],
      status: 'Assigned'
    }, currentUser?.username || 'admin');
    setAssignModal(null);
    setSelectedAssignee('');
    loadData();
  };

  const handleCheckInAsset = (assetId) => {
    if (window.confirm('Check-in this equipment back to lab inventory?')) {
      db.updateAsset(assetId, {
        assigned_to: 'Unassigned (Lab Stock)',
        assigned_date: null,
        status: 'In Lab Stock'
      }, currentUser?.username || 'admin');
      loadData();
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchSearch = 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.serial.toLowerCase().includes(search.toLowerCase()) ||
      a.assigned_to.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExportCSV = () => {
    const rows = assets.map(a => ({
      AssetID: a.id,
      Name: a.name,
      Category: a.category,
      Serial: a.serial,
      Department: a.department,
      AssignedTo: a.assigned_to,
      AssignedDate: a.assigned_date || '—',
      Status: a.status,
      Condition: a.condition
    }));
    exportToCSV(`reude_asset_inventory_${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <Section 
      title="Hardware & Asset Inventory Management" 
      subtitle="Track workstation hardware, flight kits, lab sensors, checkouts, and equipment custody."
      action={
        <div className="flex gap-2">
          {canManage && (
            <button onClick={() => setNewAssetModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
              <Plus size={14} /> Add New Asset
            </button>
          )}
          <button onClick={handleExportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
        </div>
      }
    >
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Assets Tracked</span>
          <div className="text-3xl font-black text-slate-800 dark:text-white">{assets.length}</div>
          <p className="text-xs text-slate-500 mt-2">Valued engineering hardware</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Currently Assigned</span>
          <div className="text-3xl font-black text-orange-500">
            {assets.filter(a => a.status === 'Assigned').length}
          </div>
          <p className="text-xs text-slate-500 mt-2">Checked out to staff & interns</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Available in Stock</span>
          <div className="text-3xl font-black text-emerald-600">
            {assets.filter(a => a.status === 'In Lab Stock').length}
          </div>
          <p className="text-xs text-slate-500 mt-2">Ready for deployment</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2rem] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Facility Hub</span>
          <div className="text-3xl font-black text-blue-500">Chennai R&D</div>
          <p className="text-xs text-slate-500 mt-2">Avionics & Robotics Testing</p>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-4 top-3 text-slate-400" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search asset, serial, or assignee..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pl-10 text-xs font-medium focus:outline-none focus:border-reude text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {['All', 'Assigned', 'In Lab Stock'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Asset Tag</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Equipment Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Serial Number</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Department</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Custody / Assignee</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Condition</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredAssets.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-xs text-orange-500">{a.id}</td>
                  <td className="p-4">
                    <div className="font-extrabold text-slate-800 dark:text-white text-sm">{a.name}</div>
                    <span className="text-[11px] text-slate-400">{a.category}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-500">{a.serial}</td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-300">{a.department}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-white text-xs">{a.assigned_to}</div>
                    {a.assigned_date && <span className="text-[10px] text-slate-400 font-mono">Since {a.assigned_date}</span>}
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {a.condition}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {canManage && (
                      <div className="flex justify-end gap-2">
                        {a.status === 'Assigned' ? (
                          <button 
                            onClick={() => handleCheckInAsset(a.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200"
                          >
                            Return to Stock
                          </button>
                        ) : (
                          <button 
                            onClick={() => setAssignModal(a)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-reude text-white text-xs font-bold shadow-sm"
                          >
                            Check Out / Assign
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW ASSET MODAL */}
      <AnimatePresence>
        {newAssetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewAssetModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setNewAssetModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={20} /></button>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Add Hardware Asset</h3>
              <form onSubmit={handleAddAsset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Equipment Name / Model</label>
                  <input required value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})} className="input" placeholder="e.g. Dell Precision 5570" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Asset Category</label>
                  <select value={assetForm.category} onChange={e => setAssetForm({...assetForm, category: e.target.value})} className="input">
                    <option value="Laptop / Workstation">Laptop / Workstation</option>
                    <option value="Avionics Lab Kit">Avionics Lab Kit</option>
                    <option value="Sensor / Hardware">Sensor / Hardware</option>
                    <option value="Drone Platform">Drone Platform</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Serial Number / Asset Tag</label>
                  <input required value={assetForm.serial} onChange={e => setAssetForm({...assetForm, serial: e.target.value})} className="input" placeholder="e.g. SN-98214-IN" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Department Custody</label>
                  <input required value={assetForm.department} onChange={e => setAssetForm({...assetForm, department: e.target.value})} className="input" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Register Equipment</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN ASSET MODAL */}
      <AnimatePresence>
        {assignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssignModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-8 w-full max-w-md relative z-10">
              <button onClick={() => setAssignModal(null)} className="absolute top-6 right-6 text-slate-400"><X size={20} /></button>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Check Out Equipment</h3>
              <p className="text-xs text-slate-400 mb-4">Assign <strong>{assignModal.name}</strong> ({assignModal.serial})</p>
              <form onSubmit={handleAssignAsset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Assign to Staff / Intern</label>
                  <select required value={selectedAssignee} onChange={e => setSelectedAssignee(e.target.value)} className="input">
                    <option value="">-- Choose Person --</option>
                    {employees.map(e => <option key={e.id} value={`${e.first_name} ${e.last_name}`}>{e.first_name} {e.last_name} (Employee)</option>)}
                    {interns.map(i => <option key={`int-${i.id}`} value={i.name}>{i.name} (Intern)</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3">Confirm Check-Out</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
