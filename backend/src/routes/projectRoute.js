import { Router } from "express";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

const projectRouter = Router();

// Get project
projectRouter.get("/:project_id", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    const project = await Project.findById(projectId);

    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update project
projectRouter.put("/:project_id", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    const result = await Project.findByIdAndUpdate(projectId, req.body);

    if (!result) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project updated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tasks from project
projectRouter.get("/:project_id/task", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    const tasks = await Task.find({ project_id: projectId });

    if (!tasks) {
      return res.status(404).json({ message: "No tasks found." });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add task to project
projectRouter.post("/:project_id/task", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { name, desc, status, assignee } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    } else if (!name) {
      return res.status(400).json({ error: "Name is required." });
    } else if (!desc) {
      return res.status(400).json({ error: "Description is required." });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const task = await Task.create({
      project_id: projectId,
      name,
      desc,
      status,
      assignee,
    });

    await task.save();

    res.status(201).json({ message: "Task added successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default projectRouter;
