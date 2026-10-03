require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Task = require('./models/Task')
const Note = require('./models/Note')
const authRoutes = require('./routes/auth')
const authMiddleware = require('./middleware/auth')

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

// Auth routes
app.use('/auth', authRoutes)

/* ===== TASK ROUTES (protected) ===== */

// GET all tasks for the logged-in user
app.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST a new task
app.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, dueDate } = req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = await Task.create({
      user: req.userId,
      title: title.trim(),
      dueDate: dueDate || null,
    })

    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT — update a task
app.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { title, completed, dueDate } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title
    if (completed !== undefined) updates.completed = completed
    if (dueDate !== undefined) updates.dueDate = dueDate

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
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
app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted', task: deletedTask })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

/* ===== NOTE ROUTES (protected) ===== */

app.get('/notes', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

app.post('/notes', authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body

    if ((!title || title.trim() === '') && (!body || body.trim() === '')) {
      return res.status(400).json({ error: 'Note cannot be empty' })
    }

    const newNote = await Note.create({
      user: req.userId,
      title: title?.trim() || 'Untitled',
      body: body?.trim() || '',
    })

    res.status(201).json(newNote)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' })
  }
})

app.put('/notes/:id', authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title
    if (body !== undefined) updates.body = body

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    )

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' })
    }

    res.json(updatedNote)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' })
  }
})

app.delete('/notes/:id', authMiddleware, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' })
    }

    res.json({ message: 'Note deleted', note: deletedNote })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})