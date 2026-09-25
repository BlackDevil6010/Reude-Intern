const INITIAL_DATA = {
  version: 2, // Bump version to force reset localstorage
  users: [
    { id: '1', username: 'Deepak Raj', role: 'Employee', display: 'Deepak Raj', status: 'Active' },
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
    }
  ],
  interns: [
    { id: 1, intern_id: "INT001", name: "Priyadharshini", department: "IT", status: "Active" },
    { id: 2, intern_id: "INT002", name: "Yugeswaran", department: "IT", status: "Active" },
    { id: 3, intern_id: "INT003", name: "Dhanushraj", department: "IT", status: "Active" },
    { id: 4, intern_id: "INT004", name: "Kavin Kumar", department: "IT", status: "Active" },
    { id: 5, intern_id: "INT005", name: "Karthikeyan", department: "IT", status: "Active" },
    { id: 6, intern_id: "INT006", name: "Sugapriya", department: "CSE", status: "Active" }
  ],
  activity: [
    { id: 1, username: 'Deepak Raj', action: 'Logged into the system', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, username: 'Admin', action: 'System updated', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
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
        activity: data?.activity || INITIAL_DATA.activity
      };
    } catch {
      return INITIAL_DATA;
    }
  },
  saveData(data) {
    localStorage.setItem('erp_data', JSON.stringify(data));
  },
  login(user, pass) {
    if (user === 'admin' && pass === 'password') {
      return { token: 'mock-jwt-token-admin', user: INITIAL_DATA.users[1] };
    }
    const emp = this.getData().employees.find(e => e.first_name.toLowerCase() === user.toLowerCase());
    if (emp && pass === 'password') {
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
    data.employees.push({ ...newEmp, id });
    this.saveData(data);
    return data.employees;
  },
  getInterns() {
    return this.getData().interns;
  },
  addIntern(newIntern) {
    const data = this.getData();
    const id = data.interns.length > 0 ? Math.max(...data.interns.map(i => i.id)) + 1 : 1;
    data.interns.push({ ...newIntern, id });
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
