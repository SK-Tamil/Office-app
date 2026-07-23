import React, { useEffect, useState } from "react";
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

  const departmentCount = [
    ...new Set(employees.map((emp) => emp.department)),
  ].length;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">
        Employee Management System
      </h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-primary text-white shadow">
            <div className="card-body text-center">
              <h5>Total Employees</h5>
              <h2>{employees.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card bg-success text-white shadow">
            <div className="card-body text-center">
              <h5>Departments</h5>
              <h2>{departmentCount}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow p-4 mb-4">
        <h4 className="mb-3">Employee Form</h4>

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Employee ID (for Update/Delete)"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <button
            className="btn btn-success me-2"
            onClick={addEmployee}
          >
            Add Employee
          </button>

          <button
            className="btn btn-warning me-2"
            onClick={updateEmployee}
          >
            Update Employee
          </button>

          <button
            className="btn btn-danger"
            onClick={deleteEmployee}
          >
            Delete Employee
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <h4 className="mb-3">Employee Records</h4>

          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
