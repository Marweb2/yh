/** @format */

import { getAssistantId, getAvisId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import AssistantFavorite from "@/lib/models/favorite-assistant-model-final";

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

export const GET = async (req, { params }) => {
  try {
    const assistantId = getAssistantId(req);
    const { avisId } = params;

    await validateUserId(assistantId);

    const favoris = await AssistantFavorite.findOne({
      assistantId,
      avisId,
    });

    if (!favoris) {
      return createJsonResponse({
        found: false,
      });
    } else {
      return createJsonResponse({
        found: true,
      });
    }
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const assistantId = getAssistantId(req);
    const { avisId } = params;

    await validateUserId(assistantId);

    if (!isValidObjectId(avisId)) {
      return createErrorResponse("Avis must be a valid objectId", 400);
    }

    await AssistantFavorite.deleteOne({
      assistantId,
      avisId,
    });

    return createJsonResponse({ deleted: true });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
