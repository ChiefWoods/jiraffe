import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/userModel.js";

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
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users: users.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
      }),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get user
userRouter.get("/:user_id", checkUserIdParams, async (req, res) => {
  const { user_id } = req.params;

  try {
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
});

export default userRouter;
