import { Router } from 'express';
import Project from '../models/projectModel.js';

const projectRouter = Router();

projectRouter.get('/:project_id', async (req, res) => {
  try {
    const { project_id: projectId } = req.params;

    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required." });
    }

    const project = await Project.findById(projectId);

    res.status(200).json({ project });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

projectRouter.put('/:project_id', async (req, res) => {
  try {
    const { name } = req.body;
    const { project_id: projectId } = req.params;

    if (!name) {
      return res.status(400).send({ message: "All fields are required" });
    }

    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required." });
    }

    const result = await Project.findByIdAndUpdate(projectId, { name });

    if (!result) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).send({ message: "Project updated." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

projectRouter.post("/:project_id/people", async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { user_id: userId } = req.body;

    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required." });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const { member, viewer } = project;
    let result;

    if (viewer.includes(userId)) {
      result = await Project.findByIdAndUpdate(projectId, {
        $pull: {
          viewer: userId,
        },
        $push: {
          member: userId,
        },
      });
    } else if (member.includes(userId)) {
      result = await Project.findByIdAndUpdate(projectId, {
        $pull: {
          member: userId,
        },
        $push: {
          viewer: userId,
        },
      });
    } else {
      result = await Project.findByIdAndUpdate(projectId, {
        $push: {
          viewer: userId,
        },
      });
    }

    if (!result) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).send({ message: "User granted access to project." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default projectRouter;