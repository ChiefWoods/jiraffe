import express from 'express';
import { User } from '../models/userModel.js';
//import { router } from '../src/server.js';

const router = express.Router();


//Route for add a new user
router.post('/register', async (request,response) => {
    console.log("test")
    try{
        if(
            !request.body.email ||
            !request.body.name ||
            !request.body.password
        ) {
            return response.status(400).send({ 
                message: 'All fields are required' ,
            });
        }
        const newUser = {
            email: request.body.email,
            name: request.body.name,
            password: request.body.password,
        };

        const user = await User.create(newUser);

        // return response.status(201).send(user);
        return response.status(201).send({ message: 'User created successfully' });
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for login
router.post('/login', async (request,response) => {
    try{
        if(
            !request.body.email ||
            !request.body.password
        ) {
            return response.status(400).send({ 
                message: 'All fields are required' ,
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).send({ 
                message: 'Invalid email or password' 
            });
        }

        if (request.body.password !== user.password) {
            return response.status(401).send({ 
                message: 'Invalid email or password' 
            });
        }
        //JWT
        // const jwt = require('jsonwebtoken');
        // const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }); 

        return response.status(200).send({ message: 'Login successful' }); 
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


export default router;