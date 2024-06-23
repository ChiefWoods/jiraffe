import { Router } from "express";
import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";
const userRouter = Router();

// Get user
userRouter.get("/:user_id", async (req, res) => {
  try {
    const { user_id: userId } = req.params;

    if (!userId) {
      return res.status(400).send({ error: "User ID is required." });
    }

    const projects = await Project.find({
      $or: [{ admin: userId }, { member: userId }, { viewer: userId }],
    })
      .populate("admin")
      .populate("member")
      .populate("viewer");

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

userRouter.get('/username/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(user_id )) {
      console.log(`Fetching username for user ID: ${user_id }`);
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    console.log(`Fetching username for user ID: ${user_id}`);

    const user = await User.findById(user_id );
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ username: user.name });
  } catch (err) {
    console.error('Error fetching username', err);
    res.status(500).send({ message: err.message });
  }
});


export default userRouter;