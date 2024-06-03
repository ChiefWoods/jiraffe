import mongoose from 'mongoose';
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoute.js';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch(err => console.error(err));

const port = 8000;

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('./auth', authRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
