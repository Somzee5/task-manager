const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  typeOfWork: { type: String, required: true },
  ecnNumber: { type: String, required: true },
  assignedAt: { type: Date, default: Date.now }, // was "date"
  projectDescription: { type: String },

  // Whether the task is cleared (hope/cleared)
  isCleared: { type: Boolean, default: false },

  // Assigned user
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Engineer update fields
  startDate: Date,
  plannedCompletion: Date,
  actualCompletion: Date,
  pqcApproved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },

  // ✅ New time tracking fields
  startedAt: Date,
  completedAt: Date,
  pqcApprovedAt: Date,
});

module.exports = mongoose.model("Task", taskSchema);
