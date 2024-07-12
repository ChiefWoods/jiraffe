import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import projectRouter from "./routes/projectRoute.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

const port = process.env.VITE_PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/projects", projectRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
