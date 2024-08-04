/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const projetSchema = new mongoose.Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "users" },
    avisId: { type: Schema.Types.ObjectId, ref: "AvisProjet" },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    date: String,
  },
  { timestamps: true }
);

projetSchema.pre("save", async function (next) {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  this.date = `${day}/${month + 1}/${year} - ${hours}:${minutes}`;
  return next();
});

const ClientFavorite =
  mongoose.models.ClientFavorite ||
  mongoose.model("ClientFavorite", projetSchema);

export default ClientFavorite;
