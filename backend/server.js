const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

function formatRequestId(id) {
  return `REQ-${String(id).padStart(3, "0")}`;
}

app.get("/", (req, res) => {
  res.send("AI Request Tracker API is running.");
});

// Create a new request
app.post("/api/requests", (req, res) => {
  const {
    name,
    email,
    department,
    project_title,
    problem_description,
    urgency,
  } = req.body;

  if (
    !name ||
    !email ||
    !department ||
    !project_title ||
    !problem_description ||
    !urgency
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (project_title.length > 100) {
    return res.status(400).json({
      error: "Project title must be 100 characters or less.",
    });
  }

  if (problem_description.length > 500) {
    return res.status(400).json({
      error: "Problem description must be 500 characters or less.",
    });
  }

  const createdAt = new Date().toISOString();

const sql = `
  INSERT INTO requests 
  (name, email, department, project_title, problem_description, urgency, status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
`;

  db.run(
    sql,
    [name, email, department, project_title, problem_description, urgency, createdAt],
    function (error) {
      if (error) {
        return res.status(500).json({ error: "Failed to create request." });
      }

      res.status(201).json({
        message: "Request created successfully.",
        id: this.lastID,
        request_id: formatRequestId(this.lastID),
      });
    }
  );
});

// Get all requests, with optional filters
app.get("/api/requests", (req, res) => {
  const { department, status } = req.query;

  let sql = "SELECT * FROM requests WHERE 1=1";
  const params = [];

  if (department) {
    sql += " AND department = ?";
    params.push(department);
  }

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC";

  db.all(sql, params, (error, rows) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch requests." });
    }

    const formattedRows = rows.map((request) => ({
      ...request,
      request_id: formatRequestId(request.id),
    }));

    res.json(formattedRows);
  });
});

// Get one request by ID
app.get("/api/requests/:id", (req, res) => {
  db.get("SELECT * FROM requests WHERE id = ?", [req.params.id], (error, row) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch request." });
    }

    if (!row) {
      return res.status(404).json({ error: "Request not found." });
    }

    res.json({
      ...row,
      request_id: formatRequestId(row.id),
    });
  });
});

// Update request status
app.put("/api/requests/:id/status", (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Reviewing", "Approved", "Rejected"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  db.run(
    "UPDATE requests SET status = ? WHERE id = ?",
    [status, req.params.id],
    function (error) {
      if (error) {
        return res.status(500).json({ error: "Failed to update status." });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Request not found." });
      }

      res.json({ message: "Status updated successfully." });
    }
  );
});

// Get statistics
app.get("/api/stats", (req, res) => {
  const stats = {
    total: 0,
    byStatus: {},
    byDepartment: {},
  };

  db.get("SELECT COUNT(*) AS total FROM requests", [], (error, totalRow) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch total stats." });
    }

    stats.total = totalRow.total;

    db.all(
      "SELECT status, COUNT(*) AS count FROM requests GROUP BY status",
      [],
      (statusError, statusRows) => {
        if (statusError) {
          return res.status(500).json({ error: "Failed to fetch status stats." });
        }

        statusRows.forEach((row) => {
          stats.byStatus[row.status] = row.count;
        });

        db.all(
          "SELECT department, COUNT(*) AS count FROM requests GROUP BY department",
          [],
          (departmentError, departmentRows) => {
            if (departmentError) {
              return res
                .status(500)
                .json({ error: "Failed to fetch department stats." });
            }

            departmentRows.forEach((row) => {
              stats.byDepartment[row.department] = row.count;
            });

            res.json(stats);
          }
        );
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});