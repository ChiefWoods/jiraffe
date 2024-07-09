import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
