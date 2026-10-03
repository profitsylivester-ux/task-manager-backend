require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Task = require('./models/Task')
const Note = require('./models/Note')

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

/* ===== TASK ROUTES ===== */

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
    const { title, dueDate } = req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = await Task.create({
      title: title.trim(),
      dueDate: dueDate || null,
    })

    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT — update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, completed, dueDate } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title
    if (completed !== undefined) updates.completed = completed
    if (dueDate !== undefined) updates.dueDate = dueDate

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
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

/* ===== NOTE ROUTES ===== */

// GET all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

// POST a new note
app.post('/notes', async (req, res) => {
  try {
    const { title, body } = req.body

    if ((!title || title.trim() === '') && (!body || body.trim() === '')) {
      return res.status(400).json({ error: 'Note cannot be empty' })
    }

    const newNote = await Note.create({
      title: title?.trim() || 'Untitled',
      body: body?.trim() || '',
    })

    res.status(201).json(newNote)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// PUT — update a note
app.put('/notes/:id', async (req, res) => {
  try {
    const { title, body } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title
    if (body !== undefined) updates.body = body

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
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

// DELETE a note
app.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id)

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