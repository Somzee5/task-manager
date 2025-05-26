// server/routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// ✅ GET all users with role=design_engg (e.g., engineers)
router.get("/", auth, async (req, res) => {
  try {
    const { role } = req.query;

    if (!role) return res.status(400).json({ msg: "Role is required" });

    const users = await User.find({ role }, "name _id"); // only return name and _id
    res.json(users);
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
