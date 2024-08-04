/** @format */
import mongoose from "mongoose";
const { Schema } = mongoose;
import ProjetModel from "./projet-model-final";
import AvisModel from "./avis-projet-model-final";

const schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide a client"],
    },
    assistant: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide an assistant"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: ProjetModel,
      required: true,
    },
    avisId: {
      type: Schema.Types.ObjectId,
      ref: AvisModel,
      required: true,
    },
    viewedByClient: Boolean,
    notViewedByClient: Number,
    viewedByAssistant: Boolean,
    notViewedByAssistant: Number,
    modifiedByClient: Date,
    modifiedByAssistant: Date,
    deletedByClient: {
      type: Boolean,
      default: false,
    },
    deletedByAssistant: {
      type: Boolean,
      default: false,
    },
    lastMesssageSentBy: String,
    date: String,
  },
  { timestamps: true }
);

const ConversationModel =
  mongoose.models.ConversationModel ||
  mongoose.model("ConversationModel", schema);

export default ConversationModel;
