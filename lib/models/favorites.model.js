/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const projetSchema = new mongoose.Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "users" },
    assistants: [
      {
        assistant: String,
        name: String,
        username: String,
        statutProfessionnelle: String,
        correspondance: Number,
        ProjectName: String,
        date: String,
      },
    ],
  },
  { timestamps: true }
);

const ProjetModel =
  mongoose.models.favorites || mongoose.model("favorites", projetSchema);

export default ProjetModel;
