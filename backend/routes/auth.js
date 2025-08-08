const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hashed });

    res.json({ message: "User Created", user });
  } catch (error) {
    console.error("Registration error:", error); // ✅ shows real reason in server logs
    res.status(400).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token });
});

module.exports = router;
