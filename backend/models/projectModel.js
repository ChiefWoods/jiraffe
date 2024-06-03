import mongoose from "mongoose";
import User from './userModel.js';

const projectSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        admin:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        member:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            }
        ],
        viewer:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            }
        ],
    },
    {
        timestamps: true,
    }
)

export const Project = mongoose.model('Project', projectSchema);