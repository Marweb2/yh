/** @format */
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet-model-final";
import AvisProjet from "@/lib/models/avis-projet-model-final";
import calculerPourcentageCorrespondance from "@/lib/algorithm";
import { matchNumber } from "@/lib/constants";

const AVIS_PER_PAGE = 4;

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
    const userId = req.nextUrl.searchParams.get("assistant");

    await validateUserId(userId);

    let projets = await AvisProjet.find({
      assistantId: userId,
      visibility: "visible",
      assistant_choice: "interested",
    })
      .select("_id")
      .sort({ correspondance: -1, createdAt: -1 })
      .populate({
        path: "projectId",
        model: "ProjetModel",
        select: "name _id",
      })
      .lean();
    if (isEmpty(projets)) {
      return createJsonResponse({ projets: [], actualProject: {} });
    }

    projets = projets.map((a) => ({ ...a.projectId, avisId: a._id }));
    const actualProjectId = projets[0];
    const actualProject = await ProjetModel.findById(
      actualProjectId._id
    ).select("-isVisible");

    return createJsonResponse({
      projets,
      actualProject,
    });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
