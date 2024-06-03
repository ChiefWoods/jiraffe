import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    } else if (!email) {
      return res.status(400).json({ error: "Email is required." });
    } else if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const project = await Project.create({
      name: `${user.name}'s Project`,
      admin: user._id,
      members: [],
      viewers: []
    })

    await project.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    } else if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});