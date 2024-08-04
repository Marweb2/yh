/** @format */

import { getAssistantId, getAvisId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import AssistantFavorite from "@/lib/models/favorite-assistant-model-final";
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

  if (user.userType !== "assistant") {
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

const isNumber = (chaine) => {
  return !isNaN(parseFloat(chaine)) && isFinite(chaine);
};

export const GET = async (req, { params }) => {
  try {
    const assistantId = getAssistantId(req);

    await validateUserId(assistantId);

    const favoris = await AssistantFavorite.find({
      assistantId,
    })
      .populate({
        path: "avisId",
        model: "AvisProjet",
        select: "-visibility -createdAt -updatedAt",
        populate: [
          {
            path: "projectId",
            model: "ProjetModel",
            select: "-isVisible",
            populate: {
              path: "clientId",
            },
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    const conv = favoris.map(async (u) => {
      const conv = await ConversationModel.findOne({
        avisId: u.avisId._id,
        assistant: assistantId,
      }).lean();
      return {
        ...u,
        conv,
      };
    });

    const promise = await Promise.all(conv);

    return createJsonResponse({
      favoris: promise,
    });
  } catch (err) {
    console.log(err);
    return createErrorResponse({ error: err.message });
  }
};

export const POST = async (req, { params }) => {
  try {
    const body = await req.json();
    const assistantId = getAssistantId(req);

    if (isEmpty(body)) {
      return createErrorResponse("Data required", 400);
    }
    await validateUserId(assistantId);

    if (!isValidObjectId(body?.avisId)) {
      return createErrorResponse("Avis must be a valid objectId", 400);
    }

    const isFavoriteAlreadyExists = await AssistantFavorite.findOne({
      assistantId: body?.assistantId,
      avisId: body?.avisId,
    });

    if (isFavoriteAlreadyExists) {
      return createErrorResponse("this favorite already exists", 400);
    }

    const favorite = await AssistantFavorite.create({
      assistantId: assistantId,
      avisId: body?.avisId,
      conversationId: body?.conversationId,
    });

    return createJsonResponse({ created: true, favorite });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
