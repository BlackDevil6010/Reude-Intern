// Initial schema and persistent storage for REUDE ERP

const INITIAL_ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full system control, roles, users, audit, backups & configurations' },
  { id: 'management', name: 'Management', description: 'Executive workforce oversight, approvals, and performance analytics' },
  { id: 'employee', name: 'Employee', description: 'Self-service workspace, personal profile, requests, and assigned tasks' }
];

const INITIAL_PERMISSIONS = [
  { id: 'roles.manage', module: 'System', label: 'Manage Roles & Permissions Matrix' },
  { id: 'users.manage', module: 'System', label: 'Manage & Invite Users' },
  { id: 'audit.view', module: 'System', label: 'View System Audit Trail' },
  { id: 'approvals.manage', module: 'Workflow', label: 'Manage Document Approval Chains' },
  { id: 'reports.export', module: 'Analytics', label: 'Export Reports (CSV/PDF)' },
  { id: 'settings.manage', module: 'System', label: 'Manage Company & System Settings' },
  { id: 'data.import', module: 'Data', label: 'Bulk Candidate & Data Import' },
  { id: 'workforce.edit', module: 'Workforce', label: 'Create & Modify Employee Records' },
  { id: 'interns.edit', module: 'Workforce', label: 'Create & Modify Intern Records' },
  { id: 'approvals.act', module: 'Workflow', label: 'Approve / Reject Leave & Documents' },
  { id: 'self.profile', module: 'Self-Service', label: 'View & Request Profile Updates' },
  { id: 'self.documents', module: 'Self-Service', label: 'Sign & View Personal Documents' },
  { id: 'self.leave', module: 'Self-Service', label: 'Apply & Track Personal Leave' },
  { id: 'self.requests', module: 'Self-Service', label: 'Submit HR Letter Requests' },
  { id: 'self.payslips', module: 'Self-Service', label: 'View Personal Payslips' }
];

const INITIAL_ROLE_PERMISSIONS = {
  Admin: [
    'roles.manage', 'users.manage', 'audit.view', 'approvals.manage', 
    'reports.export', 'settings.manage', 'data.import', 'workforce.edit', 
    'interns.edit', 'approvals.act', 'self.profile', 'self.documents', 
    'self.leave', 'self.requests', 'self.payslips'
  ],
  Management: [
    'reports.export', 'approvals.act', 'self.profile', 'self.documents', 
    'self.leave', 'self.requests', 'self.payslips'
  ],
  Employee: [
    'self.profile', 'self.documents', 'self.leave', 'self.requests', 'self.payslips'
  ]
};

const INITIAL_DATA = {
  version: 9, // Incremented to version 9 for RBAC, Self-Service, Approvals, Audit & Reports
  roles: INITIAL_ROLES,
  permissions: INITIAL_PERMISSIONS,
  role_permissions: INITIAL_ROLE_PERMISSIONS,
  users: [
    { id: 'admin', username: 'admin', email: 'admin@reude.tech', role: 'Admin', display: 'System Admin', status: 'Active', last_login: '2026-10-07 18:30', created_at: '2026-09-01' },
    { id: 'mgmt', username: 'management', email: 'mgmt@reude.tech', role: 'Management', display: 'Management Desk', status: 'Active', last_login: '2026-10-07 14:15', created_at: '2026-09-01' },
    { id: '1', username: 'Deepak Raj', email: 'deepakraj.ranganathan@reude.tech', role: 'Employee', display: 'Deepak Raj', status: 'Active', last_login: '2026-10-06 20:30', created_at: '2026-09-10' },
    { id: '2', username: 'Kandan V', email: 'kandan.vadivel@reude.tech', role: 'Employee', display: 'Kandan V', status: 'Active', last_login: '2026-10-05 11:20', created_at: '2026-09-15' }
  ],
  employees: [
    {
      id: 1,
      user_id: '1',
      employee_id: "EMP001",
      first_name: "Deepak",
      middle_name: "",
      last_name: "Raj",
      gender: "Male",
      date_of_birth: "2004-08-03",
      personal_email: "deepakraj0408040@gmail.com",
      work_email: "deepakraj.ranganathan@reude.tech",
      mobile_number: "9080226398",
      alternate_mobile: "9094113251",
      profile_photo_url: null,
      address_line_1: "No 17 Aarangan street, Vijayalakshmipuram",
      address_line_2: "Ambattur",
      city: "Chennai",
      state: "TamilNadu",
      postal_code: "600053",
      country: "India",
      department: "Engineering",
      designation: "Design Engineer",
      employment_type: "Full-time",
      joining_date: "2025-11-03",
      employment_status: "Active",
      reporting_manager_id: "veerapradeepan.murugapandian@reude.tech",
      work_location: "SEC",
      work_shift: "Day shift (9am-6pm)",
      highest_qualification: "BE Aeronautical",
      years_of_experience: 1,
      skills: "Structural Design (solidworks,Catia,AutoCAD)\r\nDrone pilot",
      emergency_contact_name: "Bharathi",
      emergency_contact_relationship: "Mother",
      emergency_contact_number: "9094113251",
      username: "Deepak Raj",
      role: "Employee",
      account_status: "Active"
    },
    {
      id: 2,
      user_id: '2',
      employee_id: "RE00021",
      first_name: "Kandan",
      middle_name: "",
      last_name: "V",
      gender: "Male",
      date_of_birth: "2000-10-19",
      personal_email: "kandanvadivel222@gmail.com",
      work_email: "kandan.vadivel@reude.tech",
      mobile_number: "7358689488",
      alternate_mobile: "",
      profile_photo_url: null,
      address_line_1: "No.5, 5th Street, 3rd cross street",
      address_line_2: "Vijayaragavapuram",
      city: "Chennai",
      state: "Tamilnadu",
      postal_code: "600093",
      country: "INDIA",
      department: "IT & SOFTWARE DEVELOPMENT",
      designation: "Software Engineer",
      employment_type: "Full-time",
      joining_date: "2025-09-01",
      employment_status: "Permanent",
      reporting_manager_id: "KEERTHANA RADHAKRISHNAN, RAJESH KUMAR BALARAMAN",
      work_location: "CHENNAI",
      work_shift: "morning",
      highest_qualification: "B TECH",
      years_of_experience: "1yr",
      skills: "AI & DS",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_number: "",
      username: "Kandan V",
      role: "Employee",
      account_status: "Active"
    }
  ],
  interns: [
    { id: 1, intern_id: "INT001", name: "Priyadharshini", department: "Full Stack Developer intern", status: "Active", email: "32priyadharshini@gmail.com", skills: "HTML, Git", duration: "3 months", working_mode: "remote", place: "Coimbatore", supervisor: "Deepak Raj", task_assigned: "Sales and inventory", start_date: "2026-09-01", end_date: "2026-12-01", dob: "2004-05-15", gender: "Female", performance: 5 },
    { id: 2, intern_id: "INT002", name: "Yugeswaran", department: "Full Stack Developer intern", status: "Active", email: "yugeshdhanasekaran@gmail.com", skills: "React.js", duration: "3 months", working_mode: "onsite", place: "Chennai", supervisor: "Deepak Raj", task_assigned: "Build user dashboard", start_date: "2026-08-15", end_date: "2026-11-15", dob: "2003-11-20", gender: "Male", performance: 5 },
    { id: 3, intern_id: "INT003", name: "Dhanushraj", department: "Full Stack Developer intern", status: "Active", email: "dhanushrajshiva123@gmail.com", skills: "React.js", duration: "3 months", working_mode: "hybrid", place: "Bangalore", supervisor: "Deepak Raj", task_assigned: "API integration", start_date: "2026-09-10", end_date: "2026-12-10", dob: "2004-02-10", gender: "Male", performance: 4 },
    { id: 4, intern_id: "INT004", name: "Kavin Kumar", department: "Full Stack Developer intern", status: "Active", email: "kavinkumars.tech@gmail.com", skills: "React, Python, Java, SQL, MongoDB, Git", duration: "3 months", working_mode: "remote", place: "Coimbatore", supervisor: "Deepak Raj", task_assigned: "Database schema design", start_date: "2026-07-01", end_date: "2026-10-01", dob: "2003-08-05", gender: "Male", performance: 4 },
    { id: 5, intern_id: "INT005", name: "Karthikeyan", department: "Full Stack Developer intern", status: "Active", email: "karthikeyan2430s@gmail.com", skills: "Git", duration: "3 months", working_mode: "onsite", place: "Chennai", supervisor: "Deepak Raj", task_assigned: "Bug fixing", start_date: "2026-09-20", end_date: "2026-12-20", dob: "2002-12-12", gender: "Male", performance: 3 },
    { id: 6, intern_id: "INT006", name: "Sugapriya", department: "Full Stack Developer intern", status: "Active", email: "sugapriyaarivalagan@gmail.com", skills: "React.js", duration: "3 months", working_mode: "remote", place: "Madurai", supervisor: "Deepak Raj", task_assigned: "Component styling", start_date: "2026-09-05", end_date: "2026-12-05", dob: "2004-07-22", gender: "Female", performance: 5 }
  ],
  activity: [
    { id: 1, username: 'Deepak Raj', action: 'Logged into self-service portal', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 2, username: 'admin', action: 'Configured role permission matrix', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
  ],
  tasks: [
    { id: 1, title: 'Setup backend DB', description: 'Create SQLite schema and migrate', status: 'In Progress', assignee: 'Deepak', deadline: '2026-10-01' },
    { id: 2, title: 'Review Intern Resumes', description: 'Check skills for new hires', status: 'To Do', assignee: 'Admin', deadline: '2026-10-05' }
  ],
  announcements: [
    { id: 1, title: 'Company Holiday Notice', content: 'Office closed this Friday for regional holiday celebration.', date: new Date().toISOString().split('T')[0], priority: 'High' }
  ],
  audit_logs: [
    { id: 1, actor: 'admin', action: 'SYSTEM_INIT', entity: 'System', entity_id: 'v9', old_value: 'v8', new_value: 'v9', timestamp: '2026-10-07T10:00:00.000Z' },
    { id: 2, actor: 'admin', action: 'USER_ROLE_ASSIGN', entity: 'User', entity_id: 'mgmt', old_value: 'None', new_value: 'Management', timestamp: '2026-10-07T12:00:00.000Z' },
    { id: 3, actor: 'mgmt', action: 'APPROVAL_DECISION', entity: 'Leave', entity_id: '1', old_value: 'Pending', new_value: 'Approved', timestamp: '2026-10-07T14:30:00.000Z' }
  ],
  approval_chains: [
    { id: 'NDA', document_type: 'Non-Disclosure Agreement (NDA)', stages: ['HR Review', 'Management Approval'], reminder_days: 3, auto_remind: true },
    { id: 'OFFER', document_type: 'Employment Offer Letter', stages: ['HR Draft', 'Management Sign-off', 'Candidate Acceptance'], reminder_days: 2, auto_remind: true },
    { id: 'CERT', document_type: 'Experience & Internship Certificate', stages: ['Lead Endorsement', 'HR Sign-off'], reminder_days: 5, auto_remind: false }
  ],
  document_approvals: [
    { id: 1, title: 'Offer Letter - Senior Avionics Engineer', type: 'OFFER', candidate_name: 'Prakash Rao', department: 'Engineering', current_stage: 'Management Sign-off', status: 'Pending', requested_by: 'HR Meera', due_date: '2026-10-12', created_at: '2026-10-05' },
    { id: 2, title: 'Mutual NDA - SkyRobotics Partnership', type: 'NDA', candidate_name: 'SkyRobotics Ltd', department: 'Business Operations', current_stage: 'HR Review', status: 'Approved', requested_by: 'Admin', due_date: '2026-10-08', created_at: '2026-10-01' },
    { id: 3, title: 'Internship Certificate - Priyadharshini', type: 'CERT', candidate_name: 'Priyadharshini', department: 'IT', current_stage: 'Lead Endorsement', status: 'Pending', requested_by: 'Deepak Raj', due_date: '2026-10-15', created_at: '2026-10-06' }
  ],
  settings: {
    company_name: 'REUDE TECHNOLOGIES PRIVATE LIMITED',
    portal_title: 'REUDE Enterprise Workforce ERP',
    official_website: 'https://reude.in/',
    support_email: 'support@reude.tech',
    candidate_retention_days: 180, // Candidate data retention setting
    document_templates: [
      { id: 'tmpl_nda', name: 'Standard Employee NDA', category: 'Legal', last_updated: '2026-09-01' },
      { id: 'tmpl_offer', name: 'Full-time Employment Offer', category: 'Hiring', last_updated: '2026-09-10' },
      { id: 'tmpl_intern', name: 'Internship Agreement 3-Months', category: 'Internship', last_updated: '2026-09-15' }
    ],
    email_templates: [
      { id: 'email_welcome', name: 'Welcome & Onboarding Email', subject: 'Welcome to REUDE Technologies!' },
      { id: 'email_leave', name: 'Leave Decision Notification', subject: 'Update on your Leave Request' },
      { id: 'email_doc', name: 'Document Signature Required', subject: 'Action Required: Sign Document' }
    ],
    notification_rules: {
      email_on_task_assign: true,
      email_on_leave_decision: true,
      email_on_doc_sign: true,
      digest_frequency: 'Daily'
    }
  },
  // Employee Self-Service collections
  profile_change_requests: [
    { id: 1, user_id: '1', employee_name: 'Deepak Raj', field: 'emergency_contact_number', current_value: '9094113251', requested_value: '9884012345', reason: 'Updated family mobile number', status: 'Pending', created_at: '2026-10-06' }
  ],
  employee_documents: [
    { id: 1, user_id: '1', title: 'REUDE Employment Offer Letter', category: 'Offer Letter', status: 'Signed', signed_at: '2025-11-01', url: '#', storage: 'supabase-private' },
    { id: 2, user_id: '1', title: 'Confidentiality & NDA Agreement', category: 'NDA', status: 'Pending Signature', signed_at: null, url: '#', storage: 'supabase-private' },
    { id: 3, user_id: '1', title: 'Government ID Proof (Aadhaar / Passport)', category: 'ID Proof', status: 'Verified', signed_at: null, url: '#', storage: 'supabase-private' },
    { id: 4, user_id: '2', title: 'REUDE Employment Offer Letter', category: 'Offer Letter', status: 'Signed', signed_at: '2025-08-28', url: '#', storage: 'supabase-private' }
  ],
  onboarding_tasks: [
    { id: 1, user_id: '1', title: 'Submit signed NDA', due_date: '2026-10-15', status: 'In Progress', template: 'Core Onboarding' },
    { id: 2, user_id: '1', title: 'Configure GitHub & Work Email', due_date: '2026-10-10', status: 'Completed', template: 'Engineering Onboarding' },
    { id: 3, user_id: '1', title: 'Flight Avionics Lab Safety Briefing', due_date: '2026-10-12', status: 'Pending', template: 'Engineering Onboarding' },
    { id: 4, user_id: '2', title: 'IT Systems Access & VPN Setup', due_date: '2026-10-10', status: 'Completed', template: 'Core Onboarding' }
  ],
  leaves: [
    { id: 1, user_id: '1', employee_name: 'Deepak Raj', type: 'Casual Leave', start_date: '2026-10-15', end_date: '2026-10-16', days: 2, reason: 'Family function', status: 'Pending', applied_on: '2026-10-05', manager_comment: '' },
    { id: 2, user_id: '1', employee_name: 'Deepak Raj', type: 'Sick Leave', start_date: '2026-09-12', end_date: '2026-09-12', days: 1, reason: 'Mild fever', status: 'Approved', applied_on: '2026-09-11', manager_comment: 'Get well soon' },
    { id: 3, user_id: '2', employee_name: 'Kandan V', type: 'Casual Leave', start_date: '2026-10-20', end_date: '2026-10-22', days: 3, reason: 'Personal work', status: 'Approved', applied_on: '2026-10-02', manager_comment: 'Approved' }
  ],
  leave_balances: {
    '1': { casual: 8, sick: 6, privilege: 12 },
    '2': { casual: 10, sick: 7, privilege: 15 }
  },
  hr_requests: [
    { id: 1, user_id: '1', employee_name: 'Deepak Raj', type: 'Bonafide Certificate', purpose: 'Bank loan application', status: 'In Progress', requested_on: '2026-10-04', resolved_on: null },
    { id: 2, user_id: '1', employee_name: 'Deepak Raj', type: 'Employment Verification Letter', purpose: 'Visa requirement', status: 'Completed', requested_on: '2026-09-20', resolved_on: '2026-09-22' }
  ],
  notifications: [
    { id: 1, user_id: '1', title: 'Document Signing Pending', message: 'Please sign your Confidentiality & NDA Agreement.', read: false, date: '2026-10-07' },
    { id: 2, user_id: '1', title: 'Task Deadline Approaching', message: 'Flight Avionics Lab Safety Briefing is due on Oct 12.', read: true, date: '2026-10-06' },
    { id: 3, user_id: 'admin', title: 'Pending Approval', message: 'Offer letter for Prakash Rao requires sign-off.', read: false, date: '2026-10-07' }
  ],
  payslips: [
    { id: 1, user_id: '1', month: 'September 2026', basic: 45000, hra: 18000, allowances: 7000, deductions: 2500, net: 67500, paid_date: '2026-09-30' },
    { id: 2, user_id: '1', month: 'August 2026', basic: 45000, hra: 18000, allowances: 7000, deductions: 2500, net: 67500, paid_date: '2026-08-31' },
    { id: 3, user_id: '2', month: 'September 2026', basic: 48000, hra: 19000, allowances: 8000, deductions: 2800, net: 72200, paid_date: '2026-09-30' }
  ],
  candidates: [
    { id: 1, name: 'Sanjay Krishnan', email: 'sanjay.k@example.com', role: 'Avionics Firmware Engineer', department: 'Engineering', stage: 'Technical Interview', score: 94, source: 'LinkedIn', applied_date: '2026-10-02' },
    { id: 2, name: 'Ananya Sharma', email: 'ananya.s@example.com', role: 'Full Stack Developer', department: 'IT & Software', stage: 'Offer Proposed', score: 91, source: 'Recrulyn AI', applied_date: '2026-09-28' },
    { id: 3, name: 'Rahul Varma', email: 'rahul.v@example.com', role: 'Propulsion Research Intern', department: 'Engineering', stage: 'Screening', score: 85, source: 'Campus Drive', applied_date: '2026-10-05' }
  ]
};

export const db = {
  init() {
    const existing = localStorage.getItem('erp_data');
    if (!existing) {
      localStorage.setItem('erp_data', JSON.stringify(INITIAL_DATA));
    } else {
      try {
        const parsed = JSON.parse(existing);
        if (parsed.version !== INITIAL_DATA.version) {
          localStorage.setItem('erp_data', JSON.stringify(INITIAL_DATA));
        }
      } catch {
        localStorage.setItem('erp_data', JSON.stringify(INITIAL_DATA));
      }
    }
  },

  getData() {
    try {
      const data = JSON.parse(localStorage.getItem('erp_data'));
      if (!data || data.version !== INITIAL_DATA.version) {
        return INITIAL_DATA;
      }
      return { ...INITIAL_DATA, ...data };
    } catch {
      return INITIAL_DATA;
    }
  },

  saveData(data) {
    localStorage.setItem('erp_data', JSON.stringify(data));
  },

  // Audit Logging (Append-Only)
  logAudit(actor, action, entity, entity_id, old_val = '', new_val = '') {
    const data = this.getData();
    const entry = {
      id: (data.audit_logs?.length || 0) + 1,
      actor: actor || 'System',
      action,
      entity,
      entity_id: String(entity_id || ''),
      old_value: typeof old_val === 'object' ? JSON.stringify(old_val) : String(old_val),
      new_value: typeof new_val === 'object' ? JSON.stringify(new_val) : String(new_val),
      timestamp: new Date().toISOString()
    };
    if (!data.audit_logs) data.audit_logs = [];
    data.audit_logs.unshift(entry);
    this.saveData(data);
    return entry;
  },

  getAuditLogs() {
    return this.getData().audit_logs || [];
  },

  // Permissions & Roles
  getRoles() { return this.getData().roles || []; },
  getPermissions() { return this.getData().permissions || []; },
  getRolePermissions() { return this.getData().role_permissions || {}; },

  updateRolePermissions(roleName, newPermissions, actor = 'admin') {
    const data = this.getData();
    const old = data.role_permissions[roleName] || [];
    data.role_permissions[roleName] = newPermissions;
    this.saveData(data);
    this.logAudit(actor, 'ROLE_PERMISSIONS_UPDATE', 'Role', roleName, old.join(','), newPermissions.join(','));
    return data.role_permissions;
  },

  hasPermission(role, permissionKey) {
    const data = this.getData();
    if (role === 'Admin') return true; // Superuser override
    const perms = data.role_permissions?.[role] || [];
    return perms.includes(permissionKey);
  },

  // Users Management
  getUsers() { return this.getData().users || []; },

  inviteUser(newUser, actor = 'admin') {
    const data = this.getData();
    const user = {
      id: String(data.users.length + 1),
      username: newUser.email.split('@')[0],
      email: newUser.email,
      role: newUser.role || 'Employee',
      display: newUser.display || newUser.email.split('@')[0],
      status: 'Active',
      last_login: 'Never',
      created_at: new Date().toISOString().split('T')[0]
    };
    data.users.push(user);
    this.saveData(data);
    this.logAudit(actor, 'USER_INVITED', 'User', user.id, '', JSON.stringify(user));
    return data.users;
  },

  toggleUserStatus(userId, actor = 'admin') {
    const data = this.getData();
    const u = data.users.find(x => x.id === userId);
    if (!u) return data.users;
    const oldStatus = u.status;
    u.status = u.status === 'Active' ? 'Deactivated' : 'Active';
    this.saveData(data);
    this.logAudit(actor, 'USER_STATUS_CHANGE', 'User', userId, oldStatus, u.status);
    return data.users;
  },

  updateUserRole(userId, newRole, actor = 'admin') {
    const data = this.getData();
    const u = data.users.find(x => x.id === userId);
    if (!u) return data.users;
    const oldRole = u.role;
    u.role = newRole;
    this.saveData(data);
    this.logAudit(actor, 'USER_ROLE_CHANGE', 'User', userId, oldRole, newRole);
    return data.users;
  },

  resetUserPassword(userId, actor = 'admin') {
    const data = this.getData();
    const u = data.users.find(x => x.id === userId);
    if (u) {
      this.logAudit(actor, 'PASSWORD_RESET_FORCED', 'User', userId, '', 'TemporaryPasswordIssued');
    }
    return true;
  },

  // Document Approvals
  getDocumentApprovals() { return this.getData().document_approvals || []; },
  getApprovalChains() { return this.getData().approval_chains || []; },

  updateDocumentApprovalStatus(docId, newStatus, actor = 'admin') {
    const data = this.getData();
    const doc = data.document_approvals.find(d => d.id === docId);
    if (doc) {
      const old = doc.status;
      doc.status = newStatus;
      this.saveData(data);
      this.logAudit(actor, 'DOCUMENT_APPROVAL_UPDATE', 'Document', docId, old, newStatus);
    }
    return data.document_approvals;
  },

  // Settings & Data Controls
  getSettings() { return this.getData().settings || {}; },
  updateSettings(newSettings, actor = 'admin') {
    const data = this.getData();
    const old = data.settings;
    data.settings = { ...data.settings, ...newSettings };
    this.saveData(data);
    this.logAudit(actor, 'SETTINGS_UPDATE', 'Settings', 'global', old, newSettings);
    return data.settings;
  },

  getCandidates() { return this.getData().candidates || []; },
  addCandidate(cand, actor = 'admin') {
    const data = this.getData();
    const newCand = { ...cand, id: (data.candidates?.length || 0) + 1, applied_date: new Date().toISOString().split('T')[0] };
    if (!data.candidates) data.candidates = [];
    data.candidates.unshift(newCand);
    this.saveData(data);
    this.logAudit(actor, 'CANDIDATE_IMPORT', 'Candidate', newCand.id, '', newCand.name);
    return data.candidates;
  },

  bulkImportCandidates(candidateList, actor = 'admin') {
    const data = this.getData();
    let count = 0;
    candidateList.forEach(c => {
      data.candidates.unshift({
        id: (data.candidates.length || 0) + 1,
        name: c.name,
        email: c.email,
        role: c.role || 'Applicant',
        department: c.department || 'General',
        stage: 'Screening',
        score: Number(c.score) || 80,
        source: 'CSV Bulk Import',
        applied_date: new Date().toISOString().split('T')[0]
      });
      count++;
    });
    this.saveData(data);
    this.logAudit(actor, 'BULK_CANDIDATE_IMPORT', 'Candidate', `Batch(${count})`, '', `${count} records imported`);
    return data.candidates;
  },

  // Self-Service: Profile requests, Documents, Leaves, Onboarding, Payslips
  getProfileRequests() { return this.getData().profile_change_requests || []; },
  submitProfileRequest(req, actor = 'Employee') {
    const data = this.getData();
    const newReq = {
      ...req,
      id: (data.profile_change_requests?.length || 0) + 1,
      status: 'Pending',
      created_at: new Date().toISOString().split('T')[0]
    };
    if (!data.profile_change_requests) data.profile_change_requests = [];
    data.profile_change_requests.unshift(newReq);
    this.saveData(data);
    this.logAudit(actor, 'PROFILE_CHANGE_REQUESTED', 'Employee', req.user_id, req.current_value, req.requested_value);
    return data.profile_change_requests;
  },

  approveProfileRequest(requestId, actor = 'admin') {
    const data = this.getData();
    const req = data.profile_change_requests.find(r => r.id === requestId);
    if (!req) return data.profile_change_requests;
    req.status = 'Approved';
    // Update employee profile
    const emp = data.employees.find(e => String(e.id) === String(req.user_id) || String(e.user_id) === String(req.user_id));
    if (emp && req.field) {
      emp[req.field] = req.requested_value;
    }
    this.saveData(data);
    this.logAudit(actor, 'PROFILE_CHANGE_APPROVED', 'Employee', req.user_id, req.current_value, req.requested_value);
    return data.profile_change_requests;
  },

  getEmployeeDocuments(userId) {
    const all = this.getData().employee_documents || [];
    if (!userId) return all;
    return all.filter(d => String(d.user_id) === String(userId));
  },

  signDocument(docId, actor = 'Employee') {
    const data = this.getData();
    const doc = data.employee_documents.find(d => d.id === docId);
    if (doc) {
      doc.status = 'Signed';
      doc.signed_at = new Date().toISOString().split('T')[0];
      this.saveData(data);
      this.logAudit(actor, 'DOCUMENT_SIGNED', 'Document', docId, 'Pending', 'Signed');
    }
    return data.employee_documents;
  },

  uploadDocumentProof(newDoc, actor = 'Employee') {
    const data = this.getData();
    const doc = {
      ...newDoc,
      id: (data.employee_documents?.length || 0) + 1,
      signed_at: null,
      storage: 'supabase-private-signed'
    };
    data.employee_documents.push(doc);
    this.saveData(data);
    this.logAudit(actor, 'DOCUMENT_UPLOADED', 'Document', doc.id, '', doc.title);
    return data.employee_documents;
  },

  getOnboardingTasks(userId) {
    const all = this.getData().onboarding_tasks || [];
    if (!userId) return all;
    return all.filter(t => String(t.user_id) === String(userId));
  },

  toggleOnboardingTask(taskId, actor = 'Employee') {
    const data = this.getData();
    const task = data.onboarding_tasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
      this.saveData(data);
      this.logAudit(actor, 'ONBOARDING_TASK_UPDATE', 'Task', taskId, '', task.status);
    }
    return data.onboarding_tasks;
  },

  getLeaves(userId) {
    const all = this.getData().leaves || [];
    if (!userId) return all;
    return all.filter(l => String(l.user_id) === String(userId));
  },

  applyLeave(newLeave, actor = 'Employee') {
    const data = this.getData();
    const leave = {
      ...newLeave,
      id: (data.leaves?.length || 0) + 1,
      status: 'Pending',
      applied_on: new Date().toISOString().split('T')[0],
      manager_comment: ''
    };
    if (!data.leaves) data.leaves = [];
    data.leaves.unshift(leave);
    this.saveData(data);
    this.logAudit(actor, 'LEAVE_APPLIED', 'Leave', leave.id, '', `${leave.days} days (${leave.type})`);
    return data.leaves;
  },

  cancelLeave(leaveId, actor = 'Employee') {
    const data = this.getData();
    const leave = data.leaves.find(l => l.id === leaveId);
    if (leave && leave.status === 'Pending') {
      leave.status = 'Cancelled';
      this.saveData(data);
      this.logAudit(actor, 'LEAVE_CANCELLED', 'Leave', leaveId, 'Pending', 'Cancelled');
    }
    return data.leaves;
  },

  updateLeaveStatus(leaveId, newStatus, comment = '', actor = 'Management') {
    const data = this.getData();
    const leave = data.leaves.find(l => l.id === leaveId);
    if (leave) {
      const old = leave.status;
      leave.status = newStatus;
      leave.manager_comment = comment;
      this.saveData(data);
      this.logAudit(actor, 'LEAVE_STATUS_DECISION', 'Leave', leaveId, old, newStatus);
    }
    return data.leaves;
  },

  getHRRequests(userId) {
    const all = this.getData().hr_requests || [];
    if (!userId) return all;
    return all.filter(r => String(r.user_id) === String(userId));
  },

  submitHRRequest(newReq, actor = 'Employee') {
    const data = this.getData();
    const req = {
      ...newReq,
      id: (data.hr_requests?.length || 0) + 1,
      status: 'Pending',
      requested_on: new Date().toISOString().split('T')[0],
      resolved_on: null
    };
    if (!data.hr_requests) data.hr_requests = [];
    data.hr_requests.unshift(req);
    this.saveData(data);
    this.logAudit(actor, 'HR_REQUEST_SUBMITTED', 'Request', req.id, '', req.type);
    return data.hr_requests;
  },

  getPayslips(userId) {
    const all = this.getData().payslips || [];
    if (!userId) return all;
    return all.filter(p => String(p.user_id) === String(userId));
  },

  getNotifications(userId) {
    const all = this.getData().notifications || [];
    if (!userId) return all;
    return all.filter(n => String(n.user_id) === String(userId) || n.user_id === 'all');
  },

  // Auth, Employees, Interns & Tasks
  login(user, pass) {
    const cleanUser = (user || '').trim().toLowerCase();
    const data = this.getData();
    if (cleanUser === 'admin' && (pass === 'Reude@Admin$2026' || pass === 'ChangeMe!2026')) {
      const adminUser = data.users.find(u => u.username === 'admin') || INITIAL_DATA.users[0];
      adminUser.last_login = new Date().toLocaleString();
      this.saveData(data);
      this.logAudit('admin', 'LOGIN_SUCCESS', 'Auth', 'admin', '', 'Logged in as Admin');
      return { token: 'mock-jwt-token-admin', user: adminUser };
    }
    if ((cleanUser === 'management' || cleanUser === 'mgmt') && (pass === 'Reude@Mgmt$2026' || pass === 'ChangeMe!2026')) {
      const mgmtUser = data.users.find(u => u.username === 'management') || INITIAL_DATA.users[1];
      mgmtUser.last_login = new Date().toLocaleString();
      this.saveData(data);
      this.logAudit('management', 'LOGIN_SUCCESS', 'Auth', 'management', '', 'Logged in as Management');
      return { token: 'mock-jwt-token-mgmt', user: mgmtUser };
    }
    const emp = data.employees.find(e => e.first_name.toLowerCase() === cleanUser);
    if (emp && (pass === 'password' || pass === 'ChangeMe!2026')) {
      const empUser = data.users.find(u => String(u.id) === String(emp.id) || u.username.toLowerCase() === cleanUser) || {
        id: String(emp.id),
        username: emp.first_name,
        display: `${emp.first_name} ${emp.last_name}`.trim(),
        role: emp.role || 'Employee'
      };
      empUser.last_login = new Date().toLocaleString();
      this.saveData(data);
      this.logAudit(emp.first_name, 'LOGIN_SUCCESS', 'Auth', emp.id, '', 'Logged in as Employee');
      return { token: 'mock-jwt-token-emp', user: empUser };
    }
    throw new Error('Invalid credentials');
  },

  getDashboard() {
    const data = this.getData();
    return {
      kpis: {
        employees: data.employees.length,
        interns: data.interns.length,
        active: data.employees.filter(e => e.employment_status === 'Active' || e.employment_status === 'Permanent').length,
        leave: data.employees.filter(e => e.employment_status === 'On Leave').length,
      },
      recent: data.activity.slice(0, 5)
    };
  },

  getEmployees(q = '') {
    const data = this.getData();
    if (!q) return data.employees;
    return data.employees.filter(e => 
      e.first_name.toLowerCase().includes(q.toLowerCase()) || 
      e.last_name.toLowerCase().includes(q.toLowerCase()) ||
      (e.department && e.department.toLowerCase().includes(q.toLowerCase()))
    );
  },

  addEmployee(newEmp) {
    const data = this.getData();
    const id = data.employees.length > 0 ? Math.max(...data.employees.map(e => e.id)) + 1 : 1;
    const employee_id = `EMP${String(id).padStart(3, '0')}`;
    const emp = { ...newEmp, id, employee_id };
    data.employees.push(emp);
    this.saveData(data);
    this.logAudit('admin', 'EMPLOYEE_CREATE', 'Employee', id, '', emp.first_name);
    return data.employees;
  },

  getInterns() { return this.getData().interns; },
  addIntern(newIntern) {
    const data = this.getData();
    const id = data.interns.length > 0 ? Math.max(...data.interns.map(i => i.id)) + 1 : 1;
    const intern_id = `INT${String(id).padStart(3, '0')}`;
    const int = { ...newIntern, id, intern_id };
    data.interns.push(int);
    this.saveData(data);
    this.logAudit('admin', 'INTERN_CREATE', 'Intern', id, '', int.name);
    return data.interns;
  },

  updateIntern(id, updatedData) {
    const data = this.getData();
    const index = data.interns.findIndex(i => i.id === id);
    if (index !== -1) {
      data.interns[index] = { ...data.interns[index], ...updatedData };
      this.saveData(data);
      return data.interns;
    }
    return data.interns;
  },

  deleteIntern(id) {
    const data = this.getData();
    data.interns = data.interns.filter(i => i.id !== id);
    this.saveData(data);
    this.logAudit('admin', 'INTERN_DELETE', 'Intern', id, '', 'Removed');
    return data.interns;
  },

  getTasks() { return this.getData().tasks; },
  addTask(t) {
    const data = this.getData();
    const id = data.tasks.length > 0 ? Math.max(...data.tasks.map(x => x.id)) + 1 : 1;
    data.tasks.push({ ...t, id });
    this.saveData(data);
    return data.tasks;
  },

  updateTaskStatus(id, status) {
    const data = this.getData();
    const i = data.tasks.findIndex(x => x.id === id);
    if (i !== -1) { data.tasks[i].status = status; this.saveData(data); }
    return data.tasks;
  },

  updateTask(id, updates) {
    const data = this.getData();
    const i = data.tasks.findIndex(x => x.id === id);
    if (i !== -1) { data.tasks[i] = { ...data.tasks[i], ...updates }; this.saveData(data); }
    return data.tasks;
  },

  deleteTask(id) {
    const data = this.getData();
    data.tasks = data.tasks.filter(x => x.id !== id);
    this.saveData(data);
    return data.tasks;
  },

  getAnnouncements() { return this.getData().announcements; },
  addAnnouncement(a) {
    const data = this.getData();
    const id = data.announcements.length > 0 ? Math.max(...data.announcements.map(x => x.id)) + 1 : 1;
    data.announcements.unshift({ ...a, id, date: new Date().toISOString().split('T')[0] });
    this.saveData(data);
    return data.announcements;
  },

  deleteAnnouncement(id) {
    const data = this.getData();
    data.announcements = data.announcements.filter(x => x.id !== id);
    this.saveData(data);
    return data.announcements;
  },

  convertInternToEmployee(internId) {
    const data = this.getData();
    const intern = data.interns.find(i => i.id === internId);
    if (!intern) return data;
    const empId = data.employees.length > 0 ? Math.max(...data.employees.map(e => e.id)) + 1 : 1;
    const employee_id = `EMP${String(empId).padStart(3, '0')}`;
    data.employees.push({
      id: empId,
      employee_id,
      first_name: intern.name.split(' ')[0],
      last_name: intern.name.split(' ').slice(1).join(' ') || '',
      department: intern.department,
      designation: 'Junior ' + intern.department,
      work_email: intern.email || '',
      employment_type: 'Full-time',
      employment_status: 'Active',
      skills: intern.skills || ''
    });
    data.interns = data.interns.filter(i => i.id !== internId);
    this.saveData(data);
    this.logAudit('admin', 'INTERN_CONVERTED', 'Intern', internId, intern.name, employee_id);
    return data.interns;
  },

  exportData(actor = 'admin') {
    this.logAudit(actor, 'DATA_BACKUP_EXPORT', 'System', 'all', '', 'JSON Backup downloaded');
    return JSON.stringify(this.getData(), null, 2);
  },

  importData(jsonString, actor = 'admin') {
    try {
      const data = JSON.parse(jsonString);
      if (data.employees && data.interns) {
        data.version = INITIAL_DATA.version;
        this.saveData(data);
        this.logAudit(actor, 'DATA_BACKUP_RESTORE', 'System', 'all', '', 'JSON Backup restored');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};

db.init();
