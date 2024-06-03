import { Router } from 'express';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';

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
    res.status(500).send({ message: 'Internal server error.' });
  }
});

projectRouter.put('/:project_id', async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required." });
    }

    const result = await Project.findByIdAndUpdate(projectId, req.body);

    if (!result) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).send({ message: 'Project updated.' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error.' });
  }
});

//Route to add task
projectRouter.post('/:project_id/task', async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    const { name, desc, status, assignee } = req.body;

    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required." });
    } else if (!name) {
      return res.status(400).json({ error: "Name is required." });
    } else if (!desc) {
      return res.status(400).json({ error: "Description is required." });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({ message: 'Project not found.' });
    }

    const task = await Task.create({
      project_id: projectId,
      name,
      desc,
      status,
      assignee
    });

    await task.save();

    res.status(201).send({ message: 'Task added successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Route to get all tasks of a project
projectRouter.get('/:project_id/task', async (req, res) => {
  try {
    const { project_id: projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required." });
    }

    const tasks = await Task.find({ project: projectId });

    if (!tasks) {
      return res.status(404).send({ message: 'No tasks found.' });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default projectRouter;