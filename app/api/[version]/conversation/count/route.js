/** @format */

import { getClientId, getAvisId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import ClientFavorite from "@/lib/models/favorite-client-model-final";
import ConversationModel from "@/lib/models/conversation-model-final";

const validateUserId = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid ID");
  }

  await connectToMongo();
  const user = await UserModel.findById(userId);

  if (isEmpty(user)) {
    throw new Error("User not found");
  }

  if (user.userType !== "client" && user.userType !== "assistant") {
    throw new Error("Invalid user type");
  }

  return user;
};

const createErrorResponse = (message, status = 500) => {
  return new NextResponse(JSON.stringify({ error: message }), { status });
};

export const createJsonResponse = (data, status = 200) => {
  return new NextResponse(JSON.stringify(data), { status });
};

export const GET = async (req, { params }) => {
  try {
    const userId = req.nextUrl.searchParams.get("user");
    const userType = req.nextUrl.searchParams.get("type");

    const user = await validateUserId(userId);
    let notViewedConversation;

    if (userType === "client") {
      if (user.lastConversationViewedTime) {
        notViewedConversation = await ConversationModel.countDocuments({
          viewedByClient: false,
          client: user._id,
          modifiedByAssistant: {
            $gt: user.lastConversationViewedTime,
          },
        });
      } else {
        notViewedConversation = await ConversationModel.countDocuments({
          viewedByAssistant: false,
          client: user._id,
        });
      }
    } else {
      if (user.lastConversationViewedTime) {
        notViewedConversation = await ConversationModel.countDocuments({
          viewedByAssistant: false,
          assistant: user,
          modifiedByClient: {
            $gt: user.lastConversationViewedTime,
          },
        });
      } else {
        notViewedConversation = await ConversationModel.countDocuments({
          viewedByAssistant: false,
          assistant: user,
        });
      }
    }
    return createJsonResponse({
      notViewedConversation,
    });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};
