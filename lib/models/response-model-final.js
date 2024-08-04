/** @format */

import mongoose from "mongoose";
import { Schema } from "mongoose";
const responseSchema = new mongoose.Schema(
  {
    assistantId: { type: Schema.Types.ObjectId, ref: "users" },
    projectId: { type: Schema.Types.ObjectId, ref: "ProjetModel" },
    response: [{ type: String, minlength: 1, maxlength: 160 }],
  },
  { timestamps: true }
);

const AssitantResponse =
  mongoose.models.AssitantResponse ||
  mongoose.model("AssitantResponse", responseSchema);

export default AssitantResponse;
