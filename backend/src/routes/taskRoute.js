import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

const taskRouter = Router();

/**
 * Checks if the task ID exists and is a valid MongoDB Object ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {void}
 */
function checkTaskIdParam(req, res, next) {
  const { task_id } = req.params;

  if (!task_id) {
    return res.status(400).json({ message: "Task ID is required." });
  } else if (!mongoose.Types.ObjectId.isValid(task_id)) {
    return res.status(400).json({ message: "Task ID is not valid." });
  }

  next();
}

taskRouter
  .route("/:task_id")
  .all(checkTaskIdParam)
  // Get task
  .get(async (req, res) => {
    try {
      const { task_id } = req.params;

      const task = await Task.findById(task_id);

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      res.status(200).json({ task });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Update task
  .put(async (req, res) => {
    try {
      const { task_id } = req.params;
      const { name, desc, status, assignees } = req.body;

      if (!name && !desc && !status && !assignees?.length) {
        return res
          .status(400)
          .json({ message: "At least one field is required." });
      }

      if (!assignees?.length) {
        return res
          .status(400)
          .json({ message: "At least one assignee is required." });
      } else if (
        await assignees.some((assignee) => !User.exists({ name: assignee }))
      ) {
        return res.status(404).json({ message: "Assignee does not exist." });
      }

      if (status && !["TO DO", "IN PROGRESS", "DONE"].includes(status)) {
        return res.status(400).json({
          message:
            "Only status of 'TO DO', 'IN PROGRESS' and 'DONE' are allowed.",
        });
      }

      const newTask = {
        ...(name && { name }),
        ...(desc && { desc }),
        ...(status && { status }),
        ...(assignees?.length && {
          assignees: await Promise.all(
            assignees.map(
              async (assignee) =>
                await User.findOne({ name: assignee }).then((user) => user._id),
            ),
          ),
        }),
      };

      const result = await Task.findByIdAndUpdate(task_id, newTask, {
        new: true,
      });

      if (!result) {
        return res.status(404).json({ message: "Task not found." });
      }

      res.status(200).json({ task: result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Delete task
  .delete(async (req, res) => {
    try {
      const { task_id } = req.params;

      const result = await Task.findByIdAndDelete(task_id);

      if (!result) {
        return res.status(404).json({ message: "Task not found." });
      }

      res.status(200).json({ message: `Task ${task_id} deleted.` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default taskRouter;
