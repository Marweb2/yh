/** @format */

import mongoose from "mongoose";
import { Schema } from "mongoose";
import ProjetModel from "./projet-model-final";
const avisProjetSchema = new mongoose.Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "ProjetModel" },

    assistantId: { type: Schema.Types.ObjectId, ref: "users" },
    visibility: {
      type: String,
      default: "visible", // can be "visible" or "hidden"
    },
    visibilityInAssistant: {
      type: String,
      default: "visible", // can be "visible" or "hidden"
    },
    statut: {
      type: String,
      default: "no_choice", //can be "accepted", "rejected" or "no_choice"
    },
    isNewAvis: {
      type: Boolean,
      default: false,
    },
    isNewAvisForAssistant: {
      type: Boolean,
      default: false,
    },
    assistant_choice: {
      type: String,
      default: "no_choice", //can be "interseted", "not_interseted" or "no_choice"
    },
    correspondance: {
      type: Number,
      required: [true, "correspondance field is required"],
    },
    dateString: String,
    there_is_response: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// avisProjetSchema.pre("save", async function (next) {
//   const date = new Date();

//   const day = date.getDate();
//   const month = date.getMonth();
//   const year = date.getFullYear();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   this.dateString = `${day}/${month + 1}/${year} - ${hours}:${minutes}`;
//   return next();
// });

const AvisProjet =
  mongoose.models.AvisProjet || mongoose.model("AvisProjet", avisProjetSchema);

export default AvisProjet;
