import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api";

const departments = [
  "Tech",
  "Marketing",
  "Sales",
  "Customer Success",
  "Finance",
  "Other",
];

const statuses = ["Pending", "Reviewing", "Approved", "Rejected"];
const urgencies = ["High", "Medium", "Low"];

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    project_title: "",
    problem_description: "",
    urgency: "Medium",
  });

  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [filters]);

  async function fetchRequests() {
    const params = new URLSearchParams();

    if (filters.department) {
      params.append("department", filters.department);
    }

    if (filters.status) {
      params.append("status", filters.status);
    }

    const response = await fetch(`${API_URL}/requests?${params.toString()}`);
    const data = await response.json();
    setRequests(data);
  }

  async function fetchStats() {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    setStats(data);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }

      setSuccessMessage(
        `Request submitted successfully! Your request ID is ${data.request_id}.`
      );

      setFormData({
        name: "",
        email: "",
        department: "",
        project_title: "",
        problem_description: "",
        urgency: "Medium",
      });

      fetchRequests();
      fetchStats();
    } catch (error) {
      setErrorMessage("Could not connect to the server.");
    }
  }

  async function updateStatus(id, newStatus) {
    await fetch(`${API_URL}/requests/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchRequests();
    fetchStats();
  }

  async function openDetails(id) {
    const response = await fetch(`${API_URL}/requests/${id}`);
    const data = await response.json();
    setSelectedRequest(data);
  }

  function resetFilters() {
    setFilters({
      department: "",
      status: "",
    });
  }

  function getUrgencyClass(urgency) {
    return `urgency ${urgency.toLowerCase()}`;
  }

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Internal AI Committee Tool</p>
          <h1>AI Request Tracker</h1>
          <p>
            Submit, review, filter, and manage AI project requests in one simple
            dashboard.
          </p>
        </div>
      </header>

      <section className="layout">
        <section className="card">
          <h2>Submit a New Request</h2>

          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="form">
            <label>
              Your Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Department
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Project Title
              <input
                type="text"
                name="project_title"
                value={formData.project_title}
                onChange={handleInputChange}
                maxLength="100"
                required
              />
            </label>

            <label>
              Problem Description
              <textarea
                name="problem_description"
                value={formData.problem_description}
                onChange={handleInputChange}
                maxLength="500"
                required
              />
            </label>

            <fieldset>
              <legend>Urgency</legend>
              <div className="radio-row">
                {urgencies.map((urgency) => (
                  <label key={urgency}>
                    <input
                      type="radio"
                      name="urgency"
                      value={urgency}
                      checked={formData.urgency === urgency}
                      onChange={handleInputChange}
                    />
                    {urgency}
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="submit">Submit Request</button>
          </form>
        </section>

        <section className="dashboard">
          <section className="stats-grid">
            <div className="stat-card">
              <span>Total Requests</span>
              <strong>{stats?.total ?? 0}</strong>
            </div>

            <div className="stat-card">
              <span>By Status</span>
              {statuses.map((status) => (
                <p key={status}>
                  {status}: {stats?.byStatus?.[status] ?? 0}
                </p>
              ))}
            </div>

            <div className="stat-card">
              <span>By Department</span>
              {departments.map((department) => (
                <p key={department}>
                  {department}: {stats?.byDepartment?.[department] ?? 0}
                </p>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-header">
              <h2>Committee Dashboard</h2>

              <div className="filters">
                <select
                  value={filters.department}
                  onChange={(event) =>
                    setFilters((previousFilters) => ({
                      ...previousFilters,
                      department: event.target.value,
                    }))
                  }
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((previousFilters) => ({
                      ...previousFilters,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button type="button" className="secondary" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Project Title</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} onClick={() => openDetails(request.id)}>
                      <td>{request.request_id}</td>
                      <td>{request.name}</td>
                      <td>{request.department}</td>
                      <td>{request.project_title}</td>
                      <td>
                        <span className={getUrgencyClass(request.urgency)}>
                          {request.urgency}
                        </span>
                      </td>
                      <td onClick={(event) => event.stopPropagation()}>
                        <select
                          value={request.status}
                          onChange={(event) =>
                            updateStatus(request.id, event.target.value)
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}

                  {requests.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty">
                        No requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedRequest && (
        <div className="modal-backdrop" onClick={() => setSelectedRequest(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="section-header">
              <h2>{selectedRequest.project_title}</h2>
              <button
                type="button"
                className="secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>

            <p>
              <strong>ID:</strong> {selectedRequest.request_id}
            </p>
            <p>
              <strong>Name:</strong> {selectedRequest.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRequest.email}
            </p>
            <p>
              <strong>Department:</strong> {selectedRequest.department}
            </p>
            <p>
              <strong>Urgency:</strong> {selectedRequest.urgency}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(selectedRequest.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Problem Description:</strong>
            </p>
            <p>{selectedRequest.problem_description}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;