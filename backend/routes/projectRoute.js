import express from 'express';
import { Project } from '../models/projectModel.js';
import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';


const router = express.Router();

//Route for get user's projects
router.get('/user/:user_id', async (request, response) => {
    try{
        const { user_id } = request.params; 

        const projects = await Project.find({
            $or: [ 
              { admin: user_id }, 
              { member: user_id }, 
              { viewer: user_id },
            ],
          })
          .populate('admin') // Populate the admin field
          .populate('member') // Populate the member field
          .populate('viewer'); // Populate the viewer field 

        // Send the populated projects in the response
        response.status(200).send(projects); 

    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for get one project
router.get('/:project_id', async (request, response) => {
    try{
        const { project_id } = request.params; 

        const project = await Project.findById(project_id);

        return response.status(200).send(project); 
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



export default router;