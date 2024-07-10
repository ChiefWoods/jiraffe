import { Router } from "express";
import mongoose from "mongoose";
import { verifyToken } from "./authRoute.js";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

const userRouter = Router();

/**
 * Checks if the user ID exists and is a valid MongoDB Object ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {void}
 */
function checkUserIdParams(req, res, next) {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  } else if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ message: "User ID is not valid." });
  }

  next();
}

// Get all users
userRouter.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users: users.map(({ _id, name, email }) => {
        return {
          _id,
          name,
          email,
        };
      }),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get user
userRouter.get(
  "/:user_id",
  verifyToken,
  checkUserIdParams,
  async (req, res) => {
    try {
      const { user_id } = req.params;

      const user = await User.findById(user_id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

// Get user's projects
userRouter.get(
  "/:user_id/projects",
  verifyToken,
  checkUserIdParams,
  async (req, res) => {
    try {
      const { user_id } = req.params;

      const projects = await Project.find({
        $or: [
          { admin: user_id },
          { members: { $in: [user_id] } },
          { viewers: { $in: [user_id] } },
        ],
      });

      res.status(200).json({ projects });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

export default userRouter;
