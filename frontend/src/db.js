const INITIAL_DATA = {
  version: 7, // Bump version to force reset localstorage
  users: [
    { id: '1', username: 'Deepak Raj', role: 'Employee', display: 'Deepak Raj', status: 'Active' },
    { id: '2', username: 'Kandan V', role: 'Employee', display: 'Kandan V', status: 'Active' },
    { id: 'admin', username: 'admin', role: 'Admin', display: 'System Admin', status: 'Active' }
  ],
  employees: [
    {
      id: 1,
      user_id: 2,
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
      joining_date: "Nov 3rd, 2025",
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
      user_id: 3,
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
    { id: 1, intern_id: "INT001", name: "Priyadharshini", department: "Full Stack Developer intern", status: "Active", email: "32priyadharshini@gmail.com", skills: "HTML, Git", duration: "3 months", working_mode: "remote", place: "Coimbatore", supervisor: "Deepak Raj", task_assigned: "Sales and inventory", start_date: "2026-09-01", end_date: "2026-12-01", dob: "2004-05-15", gender: "Female" },
    { id: 2, intern_id: "INT002", name: "Yugeswaran", department: "Full Stack Developer intern", status: "Active", email: "yugeshdhanasekaran@gmail.com", skills: "React.js", duration: "3 months", working_mode: "onsite", place: "Chennai", supervisor: "Deepak Raj", task_assigned: "Build user dashboard", start_date: "2026-08-15", end_date: "2026-11-15", dob: "2003-11-20", gender: "Male" },
    { id: 3, intern_id: "INT003", name: "Dhanushraj", department: "Full Stack Developer intern", status: "Active", email: "dhanushrajshiva123@gmail.com", skills: "React.js", duration: "3 months", working_mode: "hybrid", place: "Bangalore", supervisor: "Deepak Raj", task_assigned: "API integration", start_date: "2026-09-10", end_date: "2026-12-10", dob: "2004-02-10", gender: "Male" },
    { id: 4, intern_id: "INT004", name: "Kavin Kumar", department: "Full Stack Developer intern", status: "Active", email: "kavinkumars.tech@gmail.com", skills: "React, Python, Java, SQL, MongoDB, Git", duration: "3 months", working_mode: "remote", place: "Coimbatore", supervisor: "Deepak Raj", task_assigned: "Database schema design", start_date: "2026-07-01", end_date: "2026-10-01", dob: "2003-08-05", gender: "Male" },
    { id: 5, intern_id: "INT005", name: "Karthikeyan", department: "Full Stack Developer intern", status: "Active", email: "karthikeyan2430s@gmail.com", skills: "Git", duration: "3 months", working_mode: "onsite", place: "Chennai", supervisor: "Deepak Raj", task_assigned: "Bug fixing", start_date: "2026-09-20", end_date: "2026-12-20", dob: "2002-12-12", gender: "Male" },
    { id: 6, intern_id: "INT006", name: "Sugapriya", department: "Full Stack Developer intern", status: "Active", email: "sugapriyaarivalagan@gmail.com", skills: "React.js", duration: "3 months", working_mode: "remote", place: "Madurai", supervisor: "Deepak Raj", task_assigned: "Component styling", start_date: "2026-09-05", end_date: "2026-12-05", dob: "2004-07-22", gender: "Female" }
  ],
  activity: [
    { id: 1, username: 'Deepak Raj', action: 'Logged into the system', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, username: 'Admin', action: 'System updated', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
  ],
  tasks: [
    { id: 1, title: 'Setup backend DB', description: 'Create SQLite schema and migrate', status: 'In Progress', assignee: 'Deepak', deadline: '2026-10-01' },
    { id: 2, title: 'Review Intern Resumes', description: 'Check skills for new hires', status: 'To Do', assignee: 'Admin', deadline: '2026-10-05' }
  ],
  announcements: [
    { id: 1, title: 'Company Holiday', content: 'Office closed this Friday for regional holiday.', date: new Date().toISOString().split('T')[0], priority: 'High' }
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
      return { 
        ...INITIAL_DATA, 
        ...data,
        users: data?.users || INITIAL_DATA.users,
        employees: data?.employees || INITIAL_DATA.employees,
        interns: data?.interns || INITIAL_DATA.interns,
        activity: data?.activity || INITIAL_DATA.activity,
        tasks: data?.tasks || INITIAL_DATA.tasks,
        announcements: data?.announcements || INITIAL_DATA.announcements
      };
    } catch {
      return INITIAL_DATA;
    }
  },
  saveData(data) {
    localStorage.setItem('erp_data', JSON.stringify(data));
  },
  login(user, pass) {
    if (user === 'admin' && (pass === 'Reude@Admin$2026' || pass === 'ChangeMe!2026')) {
      return { token: 'mock-jwt-token-admin', user: INITIAL_DATA.users.find(u => u.username === 'admin') };
    }
    const emp = this.getData().employees.find(e => e.first_name.toLowerCase() === user.toLowerCase());
    if (emp && (pass === 'password' || pass === 'ChangeMe!2026')) {
      return { token: 'mock-jwt-token-emp', user: { id: emp.id, username: emp.first_name, role: 'Employee' } };
    }
    throw new Error('Invalid credentials');
  },
  getDashboard() {
    const data = this.getData();
    return {
      kpis: {
        employees: data.employees.length,
        interns: data.interns.length,
        active: data.employees.filter(e => e.employment_status === 'Active').length,
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
      e.employment_status.toLowerCase().includes(q.toLowerCase())
    );
  },
  addEmployee(newEmp) {
    const data = this.getData();
    const id = data.employees.length > 0 ? Math.max(...data.employees.map(e => e.id)) + 1 : 1;
    const employee_id = `EMP${String(id).padStart(3, '0')}`;
    data.employees.push({ ...newEmp, id, employee_id });
    this.saveData(data);
    return data.employees;
  },
  getInterns() {
    return this.getData().interns;
  },
  addIntern(newIntern) {
    const data = this.getData();
    const id = data.interns.length > 0 ? Math.max(...data.interns.map(i => i.id)) + 1 : 1;
    const intern_id = `INT${String(id).padStart(3, '0')}`;
    data.interns.push({ ...newIntern, id, intern_id });
    this.saveData(data);
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
    
    // Add to employees
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
    
    // Remove from interns
    data.interns = data.interns.filter(i => i.id !== internId);
    this.saveData(data);
    return data.interns;
  },
  exportData() {
    return JSON.stringify(this.getData(), null, 2);
  },
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.employees && data.interns) {
        data.version = INITIAL_DATA.version;
        this.saveData(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};

db.init();
