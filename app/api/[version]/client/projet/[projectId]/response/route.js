/** @format */

import { getAssistantId, getAvisId, getClientId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import AssistantResponse from "@/lib/models/response-model-final";

const validateUserId = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid ID");
  }

  await connectToMongo();
  const user = await UserModel.findById(userId);

  if (isEmpty(user)) {
    throw new Error("User not found");
  }

  if (user.userType !== "client") {
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
    const clientId = getClientId(req);
    const { projectId } = params;

    await validateUserId(clientId);

    if (!isValidObjectId(projectId)) {
      return createErrorResponse("project must be a valid objectId", 400);
    }
    if (!isValidObjectId(assistantId)) {
      return createErrorResponse("assistant must be a valid objectId", 400);
    }

    const response = await AssistantResponse.findOne({
      projectId: projectId,
      assistantId,
    });

    return createJsonResponse({ response, created: true });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
