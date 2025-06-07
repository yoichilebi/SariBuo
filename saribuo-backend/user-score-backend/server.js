// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: false
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Import UserScore model
const Score = require('./models/UserScore');

// Root Route (/)
app.get('/', (req, res) => {
  res.send("Welcome to SariBuo Backend API");
});

// POST endpoint to submit score
app.post("/submit-score", async (req, res) => {
  const { username, score } = req.body;

  if (!username || !score) {
    return res.status(400).json({ error: "Username and score are required." });
  }

  try {
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved successfully!" });
  } catch (error) {
    console.error("Error saving score:", error.message);
    res.status(500).json({ error: "Failed to save score." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});