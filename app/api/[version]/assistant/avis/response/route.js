/** @format */

import { getAssistantId, getAvisId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import AssistantResponse from "@/lib/models/response-model-final";
import AvisProjet from "@/lib/models/avis-projet-model-final";

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

export const POST = async (req, { params }) => {
  try {
    const body = await req.json();
    const assistantId = getAssistantId(req);

    if (isEmpty(body)) {
      return createErrorResponse("Data required", 400);
    }
    await validateUserId(assistantId);

    if (!isValidObjectId(body?.projectId)) {
      return createErrorResponse("project must be a valid objectId", 400);
    }
    if (body?.response?.length === 0) {
      return createErrorResponse("response is required", 400);
    }

    const isResponseAlreadyExists = await AssistantResponse.findOne({
      projectId: body?.projectId,
      assistantId,
    });

    if (isResponseAlreadyExists) {
      return createErrorResponse("Assistant response already exists", 400);
    }

    const response = await AssistantResponse.create({
      projectId: body?.projectId,
      assistantId,
      response: body?.response,
    });

    await AvisProjet.findOneAndUpdate({
      projectId: body?.projectId,
      assistantId,
      there_is_response: true,
    });

    return createJsonResponse({ created: true, response });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};

export const GET = async (req, { params }) => {
  try {
    const assistantId = getAssistantId(req);
    const projectId = req.nextUrl.searchParams.get("project");

    await validateUserId(assistantId);

    if (!isValidObjectId(projectId)) {
      return createErrorResponse("project must be a valid objectId", 400);
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
