/** @format */

import mongoose from "mongoose";
import { Schema } from "mongoose";
const responseSchema = new mongoose.Schema(
  {
    assistantId: { type: Schema.Types.ObjectId, ref: "users" },
    projetId: { type: Schema.Types.ObjectId, ref: "projets" },
    response: [String],
  },
  { timestamps: true }
);

const ResponseModel =
  mongoose.models.responses || mongoose.model("responses", responseSchema);

export default ResponseModel;
