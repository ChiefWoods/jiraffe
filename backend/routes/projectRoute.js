import express from 'express';
import { Project } from '../models/projectModel.js';
import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';
import { app } from '../src/server.js';

//Route for get user's projects
app.get('/:user_id', async (request, response) => {
    try{

        const { id } = request.params;

        const projects = await Project.find({
            $or: [ // Use $or to search in any of the fields
              { admin: user._id },
              { member: user._id },
              { viewer: user._id },
            ],
          });
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})




export default app;