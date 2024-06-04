import { Router } from "express";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

const projectRouter = Router();

// Get all projects
projectRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get project
projectRouter.get("/:project_id", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
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
    const { name, assignee } = req.body;

    if (!name && !assignee) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
    }

    const newDetails = {};

    if (name) {
      newDetails.name = name;
    }

    if (assignee) {
      newDetails.assignee = assignee;
    }

    const result = await Project.findByIdAndUpdate(projectId, newDetails);

    if (!result) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: `Project ${projectId} updated.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tasks from project
projectRouter.get("/:project_id/task", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
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
      return res.status(400).json({ message: "Project ID is required." });
    } else if (!name) {
      return res.status(400).json({ message: "Name is required." });
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

    res.status(201).json({ message: `Task added to project ${projectId}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add user to project
projectRouter.post("/:project_id/user", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { user_id: userId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
    } else if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.members.push(userId);

    await project.save();

    res.status(201).json({ message: `User ${userId} added to project ${projectId}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user in project
projectRouter.put("/:project_id/user", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { user_id: userId, role } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
    } else if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    } else if (!["member", "viewer"].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "member" or "viewer".' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (role === "member") {
      if (!project.members.includes(userId)) {
        project.members.push(userId);
      }

      project.viewers = project.viewers.filter((viewer) => viewer !== userId);
    } else {
      if (!project.viewers.includes(userId)) {
        project.viewers.push(userId);
      }

      project.members = project.members.filter((member) => member !== userId);
    }

    await project.save();

    res.status(200).json({ message: `User ${userId}'s role updated in project ${projectId}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove user from project
projectRouter.delete("/:project_id/user", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { user_id: userId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
    } else if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.members = project.members.filter((member) => member !== userId);
    project.viewers = project.viewers.filter((viewer) => viewer !== userId);

    await project.save();

    res.status(200).json({ message: `User ${userId} removed from project ${projectId}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default projectRouter;
