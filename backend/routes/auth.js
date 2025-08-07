const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register",async(req,res)=>{
  const{name,email,password} = req.body;
  const hashed = await bcrypt.hash(password,10);
      try {
        const user = await User.create({name,email,password:hashed});
           res.json({message:"User Created"})
      } catch (error) {
           res.status(400).json({error: "User already exists"});
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