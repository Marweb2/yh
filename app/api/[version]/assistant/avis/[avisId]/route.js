/** @format */

import AvisProjet from "@/lib/models/avis-projet-model-final";
import { getAssistantId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";

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

export const PATCH = async (req, { params }) => {
  try {
    const { avisId } = params;
    const assistantId = getAssistantId(req);
    const choice = req.nextUrl.searchParams.get("choice");
    const isNewAvis = req.nextUrl.searchParams.get("isNew");

    await validateUserId(assistantId);

    if (!isValidObjectId(avisId)) {
      return createErrorResponse("avisId must be a valid objectId", 400);
    } else if (
      (isEmpty(choice) ||
        (choice !== "no_choice" &&
          choice !== "interested" &&
          choice != "not_interested")) &&
      !isNewAvis
    ) {
      return createErrorResponse(
        "choice is required and his value must be  no_choice, not_interested or interested",
        400
      );
    }

    if (choice) {
      await AvisProjet.findOneAndUpdate(
        { _id: avisId },
        { assistant_choice: choice }
      );
    } else {
      await AvisProjet.findOneAndUpdate(
        { _id: avisId },
        { isNewAvisForAssistant: false }
      );
    }

    return createJsonResponse({
      updated: true,
      choice,
    });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};
