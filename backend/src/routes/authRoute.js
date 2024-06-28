import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

const authRouter = Router();

/**
 * Verifies the JWT token in the authorization header of the request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {void}
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    next();
  });
}

/**
 * Checks if the email exists in the request body.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {void}
 */
function checkEmailBody(req, res, next) {
  if (!req.body.email) {
    return res.status(400).json({ message: "Email is required." });
  }

  next();
}

/**
 * Checks if the password exists in the request body.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {void}
 */
function checkPasswordBody(req, res, next) {
  if (!req.body.password) {
    return res.status(400).json({ message: "Password is required." });
  }

  next();
}

// Registers new user
authRouter.post(
  "/register",
  checkEmailBody,
  checkPasswordBody,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const project = await Project.create({
        name: `${user.name}'s Project`,
        admin: user._id,
        members: [],
        viewers: [],
      });

      await project.save();

      res.status(201).json({ user: { name, email, _id: user._id } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

// Login user
authRouter.post(
  "/login",
  checkEmailBody,
  checkPasswordBody,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password." });
      }

      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({
        token,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

export default authRouter;
