import express from 'express';
import mongoose from 'mongoose';
import authenticationRoute from './routes/authenticationRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

//26:35
const app = express();

//middleware for parsing request body
app.use(express.json());

//middleware for enabling CORS
//option 1
app.use(cors());
//option 2
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// );

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Hello World');
});

app.use('/auth', authenticationRoute);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(8000, () => {
            console.log (`App is listening to port: 8000`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ', error);
    });