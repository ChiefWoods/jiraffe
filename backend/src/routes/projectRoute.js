import { Router } from "express";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

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

projectRouter
  .route("/:project_id")
  .all(checkProjectIdParam)
  // Get project
  .get(async (req, res) => {
    try {
      const project = await Project.findById(req.params.project_id);

      res.status(200).json({ project });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Update project
  .put(async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const result = await Project.findByIdAndUpdate(
        req.params.project_id,
        { name },
        { new: true },
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
      const { name, desc, status, assignee } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const task = await Task.create({
        project_id,
        name,
        desc: desc ?? "",
        status: status ?? "TO DO",
        assignee,
      });

      await task.save();

      res.status(201).json({ task });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

projectRouter
  .route("/:project_id/user")
  .all(checkProjectIdParam, checkUserIdBody)
  // Add user to project
  .post(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { user_id } = req.body;

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      project.members.push(user_id);

      await project.save();

      res
        .status(201)
        .json({ message: `User ${user_id} added to project ${project_id}.` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Update user in project
  .put(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { user_id, role } = req.body;

      if (!["member", "viewer"].includes(role)) {
        return res
          .status(400)
          .json({ message: "Role must be either 'member' or 'viewer'." });
      }

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      if (role === "member") {
        if (!project.members.includes(user_id)) {
          project.members.push(user_id);
        }

        project.viewers = project.viewers.filter(
          (viewer) => viewer !== user_id,
        );
      } else {
        if (!project.viewers.includes(user_id)) {
          project.viewers.push(user_id);
        }

        project.members = project.members.filter(
          (member) => member !== user_id,
        );
      }

      await project.save();

      res.status(200).json({
        message: `User ${user_id}'s role updated in project ${project_id}.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
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

      project.members = project.members.filter((member) => member !== user_id);
      project.viewers = project.viewers.filter((viewer) => viewer !== user_id);

      await project.save();

      res.status(200).json({
        message: `User ${user_id} removed from project ${project_id}.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default projectRouter;
