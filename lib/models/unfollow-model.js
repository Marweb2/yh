/** @format */
import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    unfollowedUser: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const UnfollowModel =
  mongoose.models.UnfollowModel || mongoose.model("UnfollowModel", schema);

export default UnfollowModel;
