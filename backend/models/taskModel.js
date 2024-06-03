import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'Project',
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default Task = mongoose.model('Task', taskSchema);