/** @format */

import AvisProjet from "@/lib/models/avis-projet-model-final";
import { getClientId } from "@/lib/function";
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

export const PATCH = async (req, { params }) => {
  try {
    const clientId = getClientId(req);
    const { projectId, avisId } = params;
    const statut = req.nextUrl.searchParams.get("statut");
    const isNewAvis = req.nextUrl.searchParams.get("isNew");

    await validateUserId(clientId);

    if (!isValidObjectId(avisId)) {
      return createErrorResponse("avisId must be a valid objectId", 400);
    } else if (
      (isEmpty(statut) ||
        (statut !== "accepted" &&
          statut !== "rejected" &&
          statut != "no_choice")) &&
      !isNewAvis
    ) {
      return createErrorResponse(
        "statut is required and his value must be  accepted, rejected or no_choice",
        400
      );
    }

    if (statut) {
      await AvisProjet.findOneAndUpdate({ projectId, _id: avisId }, { statut });
    } else {
      await AvisProjet.findOneAndUpdate(
        { projectId, _id: avisId },
        { isNewAvis: false }
      );
    }

    return createJsonResponse({
      updated: true,
      statut,
    });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const clientId = getClientId(req);
    const type = req.nextUrl.searchParams.get("type");
    const { projectId, avisId } = params;

    await validateUserId(clientId);
    let data;

    if (!isValidObjectId(avisId)) {
      return createErrorResponse("avisId must be a valid objectId", 400);
    }
    if (type === "client") {
      data = await AvisProjet.findOneAndUpdate(
        { projectId, _id: avisId },
        { visibility: "hidden" },
        { new: true }
      );
    } else {
      data = await AvisProjet.findOneAndUpdate(
        { projectId, _id: avisId },
        { visibilityInAssistant: "hidden" },
        { new: true }
      );
    }

    return createJsonResponse({
      hiddden: true,
      data,
    });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};
