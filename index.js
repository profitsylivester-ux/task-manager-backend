require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Task = require('./models/Task')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the backend!')
})

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = await Task.create({ title: title.trim() })
    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT — update a task (title or completed)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, completed } = req.body

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted', task: deletedTask })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})