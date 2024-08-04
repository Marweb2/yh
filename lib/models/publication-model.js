/** @format */
import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide a user"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
    attachmentType: {
      type: String,
    },
    attachmentName: {
      type: String,
    },
    competence: {
      type: String,
    },
    place: String,

    dateTime: String,
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
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

  this.dateTime = dateHeureFormattee;
  return next();
});

const PublicationModel =
  mongoose.models.PublicationModel ||
  mongoose.model("PublicationModel", schema);

export default PublicationModel;
