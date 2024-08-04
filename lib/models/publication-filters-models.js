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
    noFilter: Boolean,
    filter: [String],
  },
  { timestamps: true }
);

const PublicationFilterModel =
  mongoose.models.PublicationFilterModel ||
  mongoose.model("PublicationFilterModel", schema);

export default PublicationFilterModel;
