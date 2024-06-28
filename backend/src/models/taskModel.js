import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    project_id: {
      type: String,
      required: true,
      ref: "Project",
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    status: {
      type: String,
      enum: ["TO DO", "IN PROGRESS", "DONE"],
      default: "TO DO",
    },
    assignee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
