const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://jp0916780:1234%40Abcd@cluster0.qes6n.mongodb.net/edX", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
});

// Log MongoDB connection status
mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected Successfully!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  display_name: { type: String, required: true },
  photo_url: { type: String, required: true },
  uid: { type: String, required: true, unique: true }, // Auto-generated UID
  created_time: { type: String, required: true }, // Auto-generated Timestamp
  phone_number: { type: String, required: true },
  Instructor: { type: Boolean, required: true },
  Age: { type: Number, required: true },
  InstituteName: { type: String, required: true },
  YearOfStudy: { type: String, required: true },
  courseID: { type: String, required: true },
});

// Create Mongoose Model
const User = mongoose.model("User", userSchema);

// Function to Generate UID
const generateUID = () => {
  return `UID-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// API Endpoint to Add a User
app.post("/addUser", async (req, res) => {
  try {
    const {
      email,
      display_name,
      photo_url,
      phone_number,
      Instructor,
      Age,
      InstituteName,
      YearOfStudy,
      courseID,
    } = req.body;

    // Check if all required fields are provided
    if (
      !email ||
      !display_name ||
      !photo_url ||
      !phone_number ||
      Instructor === undefined ||
      Age === undefined ||
      !InstituteName ||
      !YearOfStudy ||
      !courseID
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newUser = new User({
      email,
      display_name,
      photo_url,
      uid: generateUID(), // Auto-generated UID
      created_time: new Date().toISOString(), // Auto-generated timestamp
      phone_number,
      Instructor,
      Age,
      InstituteName,
      YearOfStudy,
      courseID,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
