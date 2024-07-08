import { Router } from "express";
import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

const projectRouter = Router();

/**
 * Checks if the project ID exists and is a valid MongoDB Object ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {void}
 */
function checkProjectIdParam(req, res, next) {
  const { project_id } = req.params;

  if (project_id === ":project_id") {
    return res.status(400).json({ message: "Project ID is required." });
  } else if (!mongoose.Types.ObjectId.isValid(project_id)) {
    return res.status(400).json({ message: "Project ID is not valid." });
  }

  next();
}

/**
 * Checks if the user ID exists and is a valid MongoDB Object ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {void}
 */
function checkUserIdBody(req, res, next) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  } else if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ message: "User ID is not valid." });
  }

  next();
}

// Get all projects
projectRouter.get("/", async (req, res) => {
  const { user_id } = req.body;

  try {
    let projects;

    if (!user_id) {
      projects = await Project.find();
    } else {
      projects = await Project.find({
        $or: [{ admin: user_id }, { members: user_id }, { viewers: user_id }],
      });
    }

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
    const { project_id } = req.params;

    try {
      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      res.status(200).json({ project });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Update project
  .put(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const result = await Project.findByIdAndUpdate(
        project_id,
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

      const project = await Project.findById(project_id);
      const assigneeObjects = await Promise.all(
        assignees.map(async (assigneeId) => {
          const user = await User.findById(assigneeId);
          return user;
        }),
      );

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const task = await Task.create({
        project_id,
        name,
        desc: desc || "",
        status: status || "TO DO",
        assignees: await Promise.all(
          assignees.map(async (assignee) => {
            return await User.findOne({ name: assignee }).then(
              (user) => user._id,
            );
          }),
        ),
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
      const { user_id, role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "User role is required." });
      }

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      if (
        project.admin.toString() === user_id ||
        project.members.includes(user_id) ||
        project.viewers.includes(user_id)
      ) {
        return res.status(400).json({ message: "User is already in project." });
      }

      if (role === "member") {
        project.members.push(user_id);
      } else if (role === "viewer") {
        project.viewers.push(user_id);
      } else {
        return res
          .status(400)
          .json({ message: "Role must be either 'member' or 'viewer'." });
      }

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

      if (!user_id) {
        return res.status(400).json({ message: "User ID is required." });
      } else if (!role) {
        return res.status(400).json({ message: "User role is required." });
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
          (viewer) => viewer.toString() !== user_id,
        );
      } else if (role === "viewer") {
        if (!project.viewers.includes(user_id)) {
          project.viewers.push(user_id);
        }

        project.members = project.members.filter(
          (member) => member.toString() !== user_id,
        );
      } else if (role === "admin") {
        return res.status(400).json({
          message: "Only one admin role is allowed and cannot be reassigned.",
        });
      } else {
        return res
          .status(400)
          .json({ message: "Role must be either 'member' or 'viewer'." });
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

      if (project.members.includes(user_id)) {
        project.members = project.members.filter(
          (member) => member.toString() !== user_id,
        );
      } else if (project.viewers.includes(user_id)) {
        project.viewers = project.viewers.filter(
          (viewer) => viewer.toString() !== user_id,
        );
      } else {
        return res.status(404).json({ message: "User not found in project." });
      }

      await project.save();

      res.status(200).json({
        message: `User ${user_id} removed from project ${project_id}.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default projectRouter;
