// server/controllers/taskController.js
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};

exports.getSpocTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignee", "email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }// server/controllers/taskController.js
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};

exports.getSpocTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignee", "email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

exports.getEngineerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching your tasks" });
  }
};

exports.updateTaskByEngineer = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const { startDate, actualCompletion, pqcApproved, ...rest } = req.body;

    // Update fields from request
    Object.assign(task, rest);

    // Track time when fields are updated
    if (startDate && !task.startedAt) {
      task.startDate = startDate;
      task.startedAt = new Date();
    }

    if (actualCompletion && !task.completedAt) {
      task.actualCompletion = actualCompletion;
      task.completedAt = new Date();
    }

    if (pqcApproved === true && !task.pqcApprovedAt) {
      task.pqcApproved = true;
      task.pqcApprovedAt = new Date();
    }

    const updatedTask = await task.save();
    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};


// Optional — OTD/SPY Calculation
exports.getEngineerMetrics = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user.id });

    const totalTasks = tasks.length;
    const otdCount = tasks.filter(t => t.actualCompletion && t.plannedCompletion && new Date(t.actualCompletion) <= new Date(t.plannedCompletion)).length;
    const spyCount = tasks.filter(t => t.pqcApproved).length;

    const otd = totalTasks ? ((otdCount / totalTasks) * 100).toFixed(2) : 0;
    const spy = totalTasks ? ((spyCount / totalTasks) * 100).toFixed(2) : 0;

    res.json({ otdPercent: otd, spyPercent: spy });
  } catch (err) {
    res.status(500).json({ msg: "Error calculating metrics" });
  }
};

};

exports.getEngineerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching your tasks" });
  }
};

exports.updateTaskByEngineer = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task" });
  }
};

// Optional — OTD/SPY Calculation
exports.getEngineerMetrics = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user.id });

    const totalTasks = tasks.length;
    const otdCount = tasks.filter(t => t.actualCompletion && t.plannedCompletion && new Date(t.actualCompletion) <= new Date(t.plannedCompletion)).length;
    const spyCount = tasks.filter(t => t.pqcApproved).length;

    const otd = totalTasks ? ((otdCount / totalTasks) * 100).toFixed(2) : 0;
    const spy = totalTasks ? ((spyCount / totalTasks) * 100).toFixed(2) : 0;

    res.json({ otdPercent: otd, spyPercent: spy });
  } catch (err) {
    res.status(500).json({ msg: "Error calculating metrics" });
  }
};
