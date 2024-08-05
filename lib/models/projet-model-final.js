/** @format */
import mongoose, { Schema } from "mongoose";

const DEFAULT_CURRENCY = "Euro";

const projetSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    desc: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
    },
    statut: {
      type: String,
      required: true,
    },
    duree: {
      type: String,
      required: true,
    },
    delai: {
      type: Number,
      default: 0,
    },
    disponibilite: {
      type: [Number],
      required: true,
    },
    tarif: {
      type: Number,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    montantForfaitaire: {
      type: Boolean,
    },
    benevolat: {
      type: Boolean,
    },
    competenceVirtuelle: {
      type: String,
      required: true,
    },
    applicationWeb: {
      type: String,
      required: true,
    },
    statutProfessionnelle: {
      type: String,
      required: true,
    },
    uniteMonaitaire: {
      type: String,
      default: DEFAULT_CURRENCY,
    },
    experiencePro: {
      type: String,
      required: true,
    },
    pays: {
      type: String,
      required: true,
    },
    province: {
      type: String,
    },
    lang: {
      type: String,
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
    dateString: String,
    deletedByClient: {
      type: Boolean,
      default: false,
    },
    deletedByAssistant: {
      type: String,
      default: "no_choice",
    },
  },
  { timestamps: true }
);

projetSchema.pre("save", async function (next) {
  const maintenant = new Date();

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const dateHeureFormattee = new Intl.DateTimeFormat("fr-FR", options).format(
    maintenant
  );

  this.dateString = dateHeureFormattee;
  return next();
});

const ProjetModel =
  mongoose.models.ProjetModel || mongoose.model("ProjetModel", projetSchema);

export default ProjetModel;
