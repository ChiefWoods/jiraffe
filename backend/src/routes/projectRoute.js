import { Router } from "express";
import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

const projectRouter = Router();

function checkProjectIdParam(req, res, next) {
  if (!req.params.project_id) {
    return res.status(400).json({ message: "Project ID is required." });
  }

  next();
}

function checkUserIdBody(req, res, next) {
  if (!req.body.user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  next();
}

// Get all projects
projectRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get project by ID
projectRouter.get("/:project_id", async (req, res) => {
  const { project_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(project_id)) {
    console.error("Valid Project ID is required.");
    return res.status(400).json({ error: "Valid Project ID is required." });
  }

  try {
    const project = await Project.findById(project_id);

    if (!project) {
      console.error("Project not found.");
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({ project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get project ID based on user ID
projectRouter.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    console.error("Valid User ID is required.");
    return res.status(400).json({ error: "Valid User ID is required." });
  }

  try {
    const project = await Project.findOne({ admin: user_id });

    if (!project) {
      console.error("Project not found.");
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json( project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update project
projectRouter.put("/:project_id", async (req, res) => {
  try {
    const { project_id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({ message: "Valid Project ID is required." });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const result = await Project.findByIdAndUpdate(
      project_id,
      { name },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ project: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

projectRouter
  .route("/:project_id/task")
  .all(checkProjectIdParam)
  // Get all tasks from project
  .get(async (req, res) => {
    try {
      const { project_id } = req.params;

      const tasks = await Task.find({ project_id });

      if (!tasks) {
        return res.status(404).json({ message: "No tasks found." });
      }

      res.status(200).json({ tasks });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Add task to project
  .post(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { name, desc, status, assignees } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const project = await Project.findById(project_id);
      const assigneeObjects = await Promise.all(assignees.map(async assigneeId => {
        const user = await User.findById(assigneeId);
        return user;
      }));

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const task = await Task.create({
        project_id,
        name,
        desc: desc ?? "",
        status: status ?? "TO DO",
        assignees:assigneeObjects,
      });

      await task.save();

      res.status(201).json({ task });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Add user to project
projectRouter
  .route("/addusertoproject")
  .post(async (req, res) => {
    try {
      const { project_id, user_id, user_role } = req.body;

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      if (user_role === "member") {
        project.members.push(user_id);
      } else if (user_role === "viewer") {
        project.viewers.push(user_id);
      }

      await project.save();

      res
        .status(201)
        .json({ message: `User ${user_id} added to project ${project_id}.` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  projectRouter
  .route("/:project_id/user")
  .all(checkProjectIdParam, checkUserIdBody)
  // Update user in project
  .put(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { user_id, role } = req.body;

      if (!["member", "viewer"].includes(role)) {
        return res.status(400).json({ message: "Role must be either 'member' or 'viewer'." });
      }

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const userIdStr = user_id.toString();

      if (role === "member") {
        if (!project.members.includes(userIdStr)) {
          project.members.push(user_id);
        }

        project.viewers = project.viewers.filter(viewer => viewer.toString() !== userIdStr);
      } else if (role === "viewer") {
        if (!project.viewers.includes(userIdStr)) {
          project.viewers.push(user_id);
        }

        project.members = project.members.filter(member => member.toString() !== userIdStr);
      } else {
        return res.status(400).json({ message: "Role must be either 'member' or 'viewer'." });
      }

      await project.save();

      res.status(200).json({
        message: `User ${user_id}'s role updated in project ${project_id}.`,
      });
    } catch (err) {
      console.error('Error updating user role:', err);
      res.status(500).json({ message: "Internal server error." });
    }
  })
  // Remove user from project
  .delete(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { user_id } = req.body;

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const userIdStr = user_id.toString();

      const originalMembersLength = project.members.length;
      const originalViewersLength = project.viewers.length;

      project.members = project.members.filter(member => member.toString() !== userIdStr);
      project.viewers = project.viewers.filter(viewer => viewer.toString() !== userIdStr);

      if (originalMembersLength === project.members.length && originalViewersLength === project.viewers.length) {
        return res.status(404).json({ message: "User not found in project." });
      }

      await project.save();

      res.status(200).json({
        message: `User ${user_id} removed from project ${project_id}.`,
      });
    } catch (err) {
      console.error('Error removing user from project:', err);
      res.status(500).json({ message: "Internal server error." });
    }
  });

// Get all projects based on user_id
projectRouter.get("/all/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    console.error("Valid User ID is required.");
    return res.status(400).json({ error: "Valid User ID is required." });
  }

  try {
    const projects = await Project.find({
      $or: [{ admin: user_id }, { members: user_id }, { viewers: user_id }],
    }).exec();

    if (!projects.length) {
      console.error("Projects not found.");
      return res.status(404).json({ error: "Projects not found." });
    }

    res.status(200).json({ projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * Get project ID based on project name
 * @deprecated Currently not in use
 */
projectRouter.get("/name/:project_name", async (req, res) => {
  const { project_name } = req.params;

  try {
    const project = await Project.findOne({ name: project_name });

    if (!project) {
      console.error("Project not found.");
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({ projectID: project._id });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default projectRouter;
