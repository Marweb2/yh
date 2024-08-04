/** @format */

import mongoose from "mongoose";
import { Schema } from "mongoose";
const projetSchema = new mongoose.Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "users" },
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      default: "Visible",
    },
    desc: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
    },
    statut: { type: String, required: true },
    duree: String,
    delai: Number,
    disponibilite: [Number],
    tarif: Number,
    montantForfaitaire: Boolean,
    benevolat: Boolean,
    competenceVirtuelle: { type: String, default: "" },
    applicationWeb: { type: String, default: "" },
    statutProfessionnelle: { type: String, default: "" },
    uniteMonaitaire: { type: String, default: "Euro" },
    experiencePro: { type: String, default: "" },
    pays: { type: String, default: "" },
    ville: { type: String, default: "" },
    province: { type: String, default: "" },
    lang: { type: String, default: "" },
    questions: { type: [String], default: [] },
    assistants: [
      {
        id: String,
        correspondance: Number,
        status: {
          type: String,
          default: "Visible",
        },
      },
    ],
    assistantsAccepted: [{ id: String }],
    assistantsFavorite: [
      {
        id: { type: Schema.Types.ObjectId, ref: "users" },
        correspondance: Number,
        date: String,
      },
    ],
    assistantsRejected: [{ id: String }],
  },
  { timestamps: true }
);

const ProjetModel =
  mongoose.models.projets || mongoose.model("projets", projetSchema);

export default ProjetModel;
