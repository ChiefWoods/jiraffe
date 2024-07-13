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
 * Generates a JSON Web Token (JWT) for the given user ID.
 *
 * @param {string} userID - The ID of the user to generate the token for.
 * @return {string} The generated JWT.
 */
function signToken(userID) {
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
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
        return res.status(401).json({ message: "Invalid password." });
      }

      const token = signToken(user._id);

      const project = await Project.findOne({ admin: user._id });

      res.status(200).json({
        token,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
        project,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

// Refresh token
authRouter.post("/refresh", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is required." });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, { userID, exp }) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    } else {
      const user = await User.findById(userID);
      const project = await Project.findOne({ admin: user._id });

      return res.status(200).json({
        token: exp - Date.now() / 1000 > 60 * 15 ? signToken(userID) : token,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
        project,
      });
    }
  });
});

export default authRouter;
