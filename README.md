# AI Request Tracker

AI Request Tracker is a simple full-stack web application for submitting, reviewing, and managing internal AI project requests. It works like a lightweight ticketing system where team members can submit ideas and committee members can review, filter, and update request statuses.

## Deployment
The frontend app is deployed via Github Pages, but due to time constraints, I was unable to get the backend working as well. Please test the app locally to see all the features. 

Link to Deployment: https://rahidas04.github.io/ai-request-tracker/

## Video Demo
Here is a video demo showing off the features and functionality of the AI Request Tracker.

Video Link: https://drive.google.com/file/d/1VPb0BbFKbEejdu6Y1TlAz51zPp17yp0E/view?usp=sharing

## Features

- Submit AI project requests through a validated form
- Save requests to a SQLite database
- Display submitted requests in a committee dashboard
- Filter requests by department and status
- Update request status directly from the dashboard
- View full request details in a modal
- Display request statistics by total count, status, and department
- Persist submitted requests and status changes after page refresh

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Styling: Custom CSS

## Project Structure

ai-request-tracker/
├── README.md
├── .gitignore
├── backend/
│   ├── database.js
│   ├── database.sql
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
└── screenshots/


## Setup Instructions

1. Clone the repository

git clone https://github.com/rahidas04/ai-request-tracker.git
cd ai-request-tracker


2. Install and run the backend

Open a terminal and run:

cd backend
npm install
npm run dev

The backend will run on:

http://localhost:5001

You can confirm it is working by opening:

http://localhost:5001

You should see:

AI Request Tracker API is running.

3. Install and run the frontend

Open a second terminal from the project root and run:

cd frontend
npm install
npm run dev

The frontend will run on:

http://localhost:5173


## How to Use the App

1. Fill out the request submission form with your name, email, department, project title, problem description, and urgency.
2. Submit the form.
3. A success message will appear with the generated request ID.
4. The request will appear in the committee dashboard.
5. Use the department and status filters to narrow down requests.
6. Use the status dropdown in the table to update a request's status.
7. Click a request row to view the full request details.
8. Refresh the page to confirm that requests and status updates persist.


## API Endpoints

| Method | Endpoint                   | Description                                               |
| ------ | -------------------------- | --------------------------------------------------------- |
| `POST` | `/api/requests`            | Create a new request                                      |
| `GET`  | `/api/requests`            | Get all requests, with optional department/status filters |
| `GET`  | `/api/requests/:id`        | Get one request by ID                                     |
| `PUT`  | `/api/requests/:id/status` | Update a request's status                                 |
| `GET`  | `/api/stats`               | Get request statistics                                    |

## Database

The app uses one SQLite table called requests.

Main fields:
id
name
email
department
project_title
problem_description
urgency
status
created_at

The database file is created automatically when the backend starts.

## Screenshots

Screenshots are included in the screenshots/ folder.

These are the screenshots you will find: 

Submission form
Committee dashboard with submitted requests
Request detail modal

## Known Limitations

1. No user authentication is included as it is not required, but would've wanted to test it out as an extra feature. 
2. No pagination is included, so the dashboard is best suited for a smaller number of requests.
3. The deployed version only works with frontend, and not backend/database. To fully run the app, you must test it locally. 

## Future Improvements

If I had more time, I would improve the app by adding user authentication for committee members, add pagination for larger request lists, and have a fully working frontend/backend deployed version rather than just frontend. 