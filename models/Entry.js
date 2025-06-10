const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  type: { type: String, enum: ['input', 'output','mapping'], required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', entrySchema);
