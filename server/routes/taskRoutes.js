// server/routes/task.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth.js"); // ✅ correct middleware

 
// SPOC routes
router.post("/", auth, taskController.createTask);
router.get("/spoc", auth, taskController.getSpocTasks);
router.delete("/:id", auth, taskController.deleteTask);

// Engineer routes
router.get("/engineer", auth, taskController.getEngineerTasks);
router.put("/:id", auth, taskController.updateTaskByEngineer);
router.get("/engineer/metrics", auth, taskController.getEngineerMetrics);

module.exports = router;
