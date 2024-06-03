import express from "express";
import cors from "cors";
import { client } from "./database.js";
import authenticationRoute from "../routes/authenticationRoute.js";

const port = 8000;

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authenticationRoute);


