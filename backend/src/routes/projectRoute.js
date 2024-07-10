import { Router } from "express";
import mongoose from "mongoose";
import { verifyToken } from "../routes/authRoute.js";
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
projectRouter.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

projectRouter
  .route("/:project_id")
  .all(verifyToken, checkProjectIdParam)
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
  .route("/:project_id/tasks")
  .all(verifyToken, checkProjectIdParam)
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

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const task = await Task.create({
        project_id,
        name,
        desc: desc || "",
        status: status || "TO DO",
        assignees,
      });

      await task.save();

      res.status(201).json({
        message: "Task added successfully.",
        task,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Get project users
projectRouter.get(
  "/:project_id/users",
  verifyToken,
  checkProjectIdParam,
  async (req, res) => {
    try {
      const { project_id } = req.params;

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const users = await User.aggregate([
        {
          $match: {
            $or: [
              { _id: project.admin },
              { _id: { $in: project.members } },
              { _id: { $in: project.viewers } },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: {
              $cond: [
                { $eq: ["$_id", project.admin] },
                "admin",
                {
                  $cond: [
                    { $in: ["$_id", project.members] },
                    "member",
                    "viewer",
                  ],
                },
              ],
            },
          },
        },
      ]);

      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

projectRouter
  .route("/:project_id/users")
  .all(verifyToken, checkProjectIdParam)
  // Add user to project
  .post(async (req, res) => {
    try {
      const { project_id } = req.params;
      const { email, role } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      } else if (!role) {
        return res.status(400).json({ message: "User role is required." });
      }

      const project = await Project.findById(project_id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      const user = await User.findOne({ email });

      if (
        project.admin.toString() === user._id ||
        project.members.includes(user._id) ||
        project.viewers.includes(user._id)
      ) {
        return res.status(400).json({ message: "User is already in project." });
      }

      if (role === "member") {
        project.members.push(user._id);
      } else if (role === "viewer") {
        project.viewers.push(user._id);
      } else {
        return res
          .status(400)
          .json({ message: "Role must be either 'member' or 'viewer'." });
      }

      await project.save();

      res.status(201).json({
        message: `${user.name} added to project ${project.name}.`,
        user: {
          _id: user._id,
          name: user.name,
          email,
          role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Update user in project
  .put(checkUserIdBody, async (req, res) => {
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

      const user = await User.findById(user_id);

      res.status(200).json({
        message: `${user.name}'s role in project ${project.name} updated.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // Remove user from project
  .delete(checkUserIdBody, async (req, res) => {
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

      const user = await User.findById(user_id);

      res.status(200).json({
        message: `${user.name} removed from project ${project.name}.`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default projectRouter;
