import express from "express";
import cors from "cors";
import { client } from "./database.js";

const port = 8000;

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));
