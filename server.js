require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Entry = require('./models/Entry');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Connect to MongoDB using the MONGODB_URI environment variable
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API Endpoints

app.post('/input', async (req, res) => {
  try {
    const entry = new Entry({ type: 'input', data: req.body });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/input', async (req, res) => {
  try {
    const entries = await Entry.find({ type: 'input' });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/output', async (req, res) => {
  try {
    const entry = new Entry({ type: 'output', data: req.body });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/output', async (req, res) => {
  try {
    const entries = await Entry.find({ type: 'output' });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get input by ID
app.get('/input/:id', async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, type: 'input' });
    if (!entry) {
      return res.status(404).json({ error: 'Input entry not found' });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get output by ID
app.get('/output/:id', async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, type: 'output' });
    if (!entry) {
      return res.status(404).json({ error: 'Output entry not found' });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update input by ID
app.put('/input/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, type: 'input' },
      { data: req.body },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ error: 'Input entry not found' });
    }
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete input by ID
app.delete('/input/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, type: 'input' });
    if (!entry) {
      return res.status(404).json({ error: 'Input entry not found' });
    }
    res.json({ message: 'Input entry deleted', entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update output by ID
app.put('/output/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, type: 'output' },
      { data: req.body },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ error: 'Output entry not found' });
    }
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete output by ID
app.delete('/output/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, type: 'output' });
    if (!entry) {
      return res.status(404).json({ error: 'Output entry not found' });
    }
    res.json({ message: 'Output entry deleted', entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
