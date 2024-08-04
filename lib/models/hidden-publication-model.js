import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    publication: {
      type: Schema.Types.ObjectId,
      ref: "publications",
      required: true,
    },
  },
  { timestamps: true }
);

const HiddenPublicationModel =
  mongoose.models.HiddenPublicationModel ||
  mongoose.model("HiddenPublicationModel", schema);

export default HiddenPublicationModel;
