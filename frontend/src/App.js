import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");

  const API = "/api";

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const addEmployee = async () => {
    if (!name || !department || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          department,
          email,
        }),
      });

      if (response.ok) {
        alert("Employee Added Successfully");

        loadEmployees();

        setName("");
        setDepartment("");
        setEmail("");
      } else {
        alert("Failed to Add Employee");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const updateEmployee = async () => {
    if (!id || !name || !department || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          department,
          email,
        }),
      });

      if (response.ok) {
        alert("Employee Updated Successfully");
      } else {
        alert("Employee Not Found");
      }

      loadEmployees();

      setId("");
      setName("");
      setDepartment("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const deleteEmployee = async () => {
    if (!id) {
      alert("Enter Employee ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API}/employees/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Employee Deleted Successfully");
      } else {
        alert("Employee Not Found");
      }

      loadEmployees();

      setId("");
      setName("");
      setDepartment("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // UI-only helper: clears the form fields without touching any API/CRUD logic
  const clearForm = () => {
    setId("");
    setName("");
    setDepartment("");
    setEmail("");
  };

  const departmentCount = [
    ...new Set(employees.map((emp) => emp.department)),
  ].length;

  // UI-only helper: generates a consistent color-coded initial badge per employee
  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(" ");
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`
        : parts[0].slice(0, 2);
    return initials.toUpperCase();
  };

  return (
    <div className="app-shell">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="app-header-brand">
            <div className="brand-mark">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 20V18C17 15.7909 15.2091 14 13 14H7C4.79086 14 3 15.7909 3 18V20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="10"
                  cy="7"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M21 20V18C21 16.1362 19.7252 14.5714 18 14.126"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M15.5 3.6C16.9006 4.11 17.9 5.42 17.9 6.95C17.9 8.48 16.9006 9.79 15.5 10.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="app-title">Employee Management System</h1>
              <p className="app-subtitle">
                Manage your organization's workforce records in one place
              </p>
            </div>
          </div>
          <div className="app-header-tag">
            <span className="status-dot" />
            System Online
          </div>
        </header>

        {/* Stat Cards */}
        <section className="stats-grid">
          <div className="stat-card stat-card--primary">
            <div className="stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 20V18C17 15.7909 15.2091 14 13 14H7C4.79086 14 3 15.7909 3 18V20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="10"
                  cy="7"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M21 20V18C21 16.1362 19.7252 14.5714 18 14.126"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M15.5 3.6C16.9006 4.11 17.9 5.42 17.9 6.95C17.9 8.48 16.9006 9.79 15.5 10.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="stat-text">
              <span className="stat-label">Total Employees</span>
              <span className="stat-value">{employees.length}</span>
            </div>
          </div>

          <div className="stat-card stat-card--accent">
            <div className="stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="3"
                  width="16"
                  height="18"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 8H16M8 12H16M8 16H12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="stat-text">
              <span className="stat-label">Departments</span>
              <span className="stat-value">{departmentCount}</span>
            </div>
          </div>
        </section>

        {/* Form Card */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="panel-title-icon"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Employee Form
            </h2>
            <p className="panel-subtitle">
              Add a new record, or enter an Employee ID to update / delete an
              existing one
            </p>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="emp-id">
                Employee ID
                <span className="form-label-hint">for update / delete</span>
              </label>
              <input
                id="emp-id"
                type="number"
                className="form-control"
                placeholder="e.g. 1024"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="emp-name">
                Full Name
              </label>
              <input
                id="emp-name"
                type="text"
                className="form-control"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="emp-department">
                Department
              </label>
              <input
                id="emp-department"
                type="text"
                className="form-control"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="emp-email">
                Email Address
              </label>
              <input
                id="emp-email"
                type="email"
                className="form-control"
                placeholder="e.g. priya.sharma@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn--add" onClick={addEmployee}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              Add Employee
            </button>

            <button className="btn btn--update" onClick={updateEmployee}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 20L4.6 16.9C4.86 15.6 5.49 14.4 6.44 13.46L15.2 4.7C16.1 3.8 17.55 3.8 18.44 4.7L19.3 5.56C20.2 6.45 20.2 7.9 19.3 8.8L10.54 17.56C9.6 18.5 8.4 19.14 7.1 19.4L4 20Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Update Employee
            </button>

            <button className="btn btn--delete" onClick={deleteEmployee}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 7H19M9.5 7V5C9.5 4.44772 9.94772 4 10.5 4H13.5C14.0523 4 14.5 4.44772 14.5 5V7M17.5 7L16.9 18.5C16.85 19.4 16.1 20 15.2 20H8.8C7.9 20 7.15 19.4 7.1 18.5L6.5 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete Employee
            </button>

            <button className="btn btn--clear" onClick={clearForm}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Clear
            </button>
          </div>
        </section>

        {/* Table Card */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="panel-title-icon"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3 9H21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              Employee Records
            </h2>
            <p className="panel-subtitle">
              {employees.length} record{employees.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>

          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="cell-id">#{emp.id}</td>
                      <td>
                        <div className="employee-cell">
                          <span className="avatar-badge">
                            {getInitials(emp.name)}
                          </span>
                          <span className="employee-name">{emp.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="dept-badge">{emp.department}</span>
                      </td>
                      <td className="cell-email">{emp.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <div className="empty-state-inner">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M17 20V18C17 15.7909 15.2091 14 13 14H7C4.79086 14 3 15.7909 3 18V20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="10"
                            cy="7"
                            r="3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <p>No employees found</p>
                        <span>Add your first employee using the form above</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="app-footer">
          Employee Management System &middot; Internal HR Dashboard
        </footer>
      </div>
    </div>
  );
}

export default App;
