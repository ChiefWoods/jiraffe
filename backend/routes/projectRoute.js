import express from 'express';
import { Project } from '../models/projectModel.js';
import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';


const router = express.Router();

//Route for get user's projects
router.get('/:userId', async (request, response) => {
    try{
        const { userId } = request.params; 

        const projects = await Project.find({
            $or: [ 
              { admin: userId }, 
              { member: userId }, 
              { viewer: userId },
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



export default router;