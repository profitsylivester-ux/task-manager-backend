# Task Manager Backend

The backend API for the Task Manager app. Built with Node.js and Express.

This is the server-side part of the task manager. It receives requests from the frontend, processes them, and returns JSON responses.

Later, it will connect to a MongoDB database and support authentication.

---

## Tech Stack

- **Node.js** — JavaScript runtime for the server
- **Express.js** — web framework for building the API
- **npm** — package manager
- **Git & GitHub** — version control

---

## Features (current)

- `GET /` — health check
- `GET /tasks` — return all tasks
- `GET /test-add` — temporary test route (adds a task)
- `GET /test-delete` — temporary test route (removes the last task)
- `GET /test-complete` — temporary test route (toggles first task)

The test routes are for development only and will be replaced by proper POST, PUT, and DELETE routes later.

---

## Planned Features

- POST /tasks — create a new task
- PUT /tasks/:id — update a task
- DELETE /tasks/:id — delete a task
- MongoDB database for permanent storage
- User authentication (login, register)
- Protected routes (only the owner can edit or delete their tasks)
- Deployment to Render or Railway

---

## Folder Structure

task-manager-backend/
├── node_modules/       (not pushed to GitHub)
├── index.js            (main server file)
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

---

## How to Run Locally

1. Clone the repository:

git clone https://github.com/profitsylivester-ux/task-manager-backend.git

2. Enter the folder:

cd task-manager-backend

3. Install dependencies:

npm install

4. Start the server:

node index.js

5. Open your browser at:

http://localhost:3000/

To test the API:

- http://localhost:3000/tasks
- http://localhost:3000/test-add
- http://localhost:3000/test-delete
- http://localhost:3000/test-complete

---

## Roadmap

- [x] Set up Express server
- [x] GET /tasks route
- [x] Temporary test routes
- [ ] Real POST, PUT, DELETE routes
- [ ] Connect to MongoDB
- [ ] User authentication
- [ ] Deploy to the cloud
- [ ] Connect to the React frontend

---

## Author

**Faida Sylivester Mosses**
Electronics & Embedded Systems Engineer | Frontend & Backend Developer
Dar es Salaam, Tanzania

- **GitHub:** https://github.com/profitsylivester-ux
- **LinkedIn:** https://www.linkedin.com/in/faida-sylivester-31b86a391/
- **Email:** profitsylivester@gmail.com

---

## License

This project is open for learning and reference.
