const mongoose = require('mongoose');

const editSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  history: [{ type: String }], // Array of URLs for undo/redo
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Edit', editSchema);