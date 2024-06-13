import { Router } from "express";
import Project from "../models/projectModel.js";

const userRouter = Router();

// Get user's projects
userRouter.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).send({ message: "User ID is required." });
    }

    const projects = await Project.find({
      $or: [{ admin: user_id }, { members: user_id }, { viewers: user_id }],
    })
      .populate("admin")
      .populate("members")
      .populate("viewers");

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default userRouter;
