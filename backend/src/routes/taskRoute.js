import { Router } from "express";
import Task from "../models/taskModel.js";

const taskRouter = Router();

// Get task
taskRouter.get("/:task_id", async (req, res) => {
  try {
    const { task_id: taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task
taskRouter.put("/:task_id", async (req, res) => {
  try {
    const { task_id: taskId } = req.params;
    const { name, desc, status, assignee } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required." });
    }

    if (!name && !desc && !status && !assignee) {
      return res
        .status(400)
        .json({ message: "At least one field is required." });
    }

    if (status && status !== "TO DO" && status !== "IN PROGRESS" && status !== "DONE") {
      return res.status(400).json({ message: 'Only status of "TO DO", "IN PROGRESS" and "DONE" are allowed.' });
    }

    const result = await Task.findByIdAndUpdate(taskId, req.body);

    if (!result) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: `Task ${taskId} updated.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
taskRouter.delete("/:task_id", async (req, res) => {
  try {
    const { task_id: taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const result = await Task.findByIdAndDelete(taskId);

    if (!result) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: `Task ${taskId} deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default taskRouter;
