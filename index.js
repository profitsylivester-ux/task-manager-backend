const express = require('express')

const app = express()
const PORT = 3000

app.use(express.json())

let tasks = [
  { id: 1, title: 'Study React', completed: true },
  { id: 2, title: 'Build a task manager', completed: false },
  { id: 3, title: 'Push to GitHub', completed: false },
]

app.get('/', (req, res) => {
  res.send('Hello from the backend!')
})

app.get('/tasks', (req, res) => {
  res.json(tasks)
})

// TEST ROUTE: add a task
app.get('/test-add', (req, res) => {
  const newTask = {
    id: Date.now(),
    title: 'Test task',
    completed: false,
  }
  tasks.push(newTask)
  res.json(newTask)
})

// TEST ROUTE: delete the last task
app.get('/test-delete', (req, res) => {
  const removed = tasks.pop()
  res.json({ removed: removed, remaining: tasks.length })
})

// TEST ROUTE: toggle the first task complete
app.get('/test-complete', (req, res) => {
  if (tasks.length === 0) {
    return res.json({ message: 'No tasks' })
  }
  tasks[0].completed = !tasks[0].completed
  res.json(tasks[0])
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})