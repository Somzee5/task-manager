const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/user");

// --- CORS Configuration ---
// Define allowed origins for production.
// process.env.CLIENT_ORIGIN will be set on Render for production.
// In local development, it will default to http://localhost:3000.
const allowedOrigins = [
  'http://localhost:3000', // For local React development
  process.env.CLIENT_ORIGIN // This will be your deployed Render frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in our allowed list.
    if (!origin) return callback(null, true); // Allow requests from same origin or no origin (e.g., Postman)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true // Important for sending cookies/auth headers
}));

app.use(express.json()); // Middleware to parse JSON request bodies

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Deprecated in newer Mongoose versions, remove if causing warnings
    // useFindAndModify: false, // Deprecated in newer Mongoose versions, remove if causing warnings
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Listen only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

module.exports = app;