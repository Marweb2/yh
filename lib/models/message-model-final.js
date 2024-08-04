/** @format */

import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new mongoose.Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "ConversationModel",
      required: [true, "Please provide a conversation id"],
    },
    contentType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message must must have content"],
      trim: true,
    },
    document: {
      type: String,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide the 'from' field"],
    },
    time: String,
    date: String,
    to: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide the 'to' field"],
    },
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  const date = new Date();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  this.time = `${hours}h${minutes}`;
  return next();
});

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", schema);

export default MessageModel;
