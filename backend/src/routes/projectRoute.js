import { Router } from 'express';
import Project from '../models/projectModel.js';

const projectRouter = Router();

projectRouter.get('/:project_id', async (req, res) => {
  try {
    const { project_id: projectId } = req.params;

    const project = await Project.findById(projectId);

    res.status(200).json({ project });
  } catch (err) {
    res.status(500).send({ message: 'Internal server error.' });
  }
});

projectRouter.put('/:project_id', async (req, res) => {
  try {
    const { name } = req.body;
    const { project_id: projectId } = req.params;

    if (!name) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const result = await Project.findByIdAndUpdate(projectId, req.body);

    if (!result) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(200).send({ message: 'Project updated.' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error.' });
  }
});

export default projectRouter;