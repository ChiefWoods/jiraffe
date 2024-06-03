import { Router } from 'express';
import Task from '../models/taskModel.js';

const taskRouter = Router();

//get one task by taskid
taskRouter.get('/:task_id', async (req, res) => {
    try {
      const { task_id } = req.params;

      const task = await Task.findById(task_id);

      res.status(200).json({ task });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
});

//update task by taskid
taskRouter.put('/:task_id', async (req, res) => {
    try {
      const { task_id } = req.params;
      const { name, desc, status, asignee } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required." });
      } else if (!desc) {
        return res.status(400).json({ error: "Description is required." });
      } else if (!status) {
        return res.status(400).json({ error: "Status is required." });
      }

      const result = await Task.findByIdAndUpdate(task_id, req.body);

      if (!result) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      return res.status(200).send({ message: 'Task updated.' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
});

//delete task by taskid
taskRouter.delete('/:task_id', async (request, response) => {
    try{
        const { task_id } = request.params;

        const result = await Task.findByIdAndDelete(task_id);

        if(!result){
            return response.status(404).json({ message: 'Task not found' });
        }

        return response.status(200).send({ message: 'Task deleted' });
        
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



export default taskRouter;