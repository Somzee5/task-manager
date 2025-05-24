// server/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  typeOfWork: { type: String, required: true },
  ecnNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  projectDescription: { type: String },
  hopeCleared: { type: String, enum: ["hope", "cleared"], default: "hope" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // For engineer updates
  startDate: Date,
  plannedCompletion: Date,
  actualCompletion: Date,
  pqcApproved: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "in progress", "completed"], default: "pending" },
});

module.exports = mongoose.model("Task", taskSchema);
