/** @format */

import ProjetModel from "@/lib/models/projet-model-final";
import AvisProjet from "@/lib/models/avis-projet-model-final";
import { getAssistantId, getProjectId } from "@/lib/function";
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

const isNumber = (chaine) => {
  return !isNaN(parseFloat(chaine)) && isFinite(chaine);
};

const DOCUMENT_LIMIT = 4;

const getPageNumber = (req) => {
  const pageNumber = req.nextUrl.searchParams.get("page");
  return isNumber(pageNumber) && pageNumber > 0 ? parseInt(pageNumber) : null;
};

export const GET = async (req, { params }) => {
  try {
    const assistantId = getAssistantId(req);
    const page = getPageNumber(req);
    const filter = req.nextUrl.searchParams.get("filter");

    if (!page) {
      return createErrorResponse("page must be a number greater than 0", 400);
    }

    if (filter !== "all" && filter !== "accepted" && filter !== "rejected") {
      return createErrorResponse(
        "page must be a 'all', 'accepted' or 'rejected'",
        400
      );
    }

    await validateUserId(assistantId);

    let avisClient;
    let countAvis;
    if (filter === "all") {
      avisClient = await AvisProjet.find({
        assistantId,
        visibility: "visible",
      })
        .select("-visibility")
        .sort({ correspondance: -1, createdAt: -1 })
        .limit(DOCUMENT_LIMIT)
        .skip((page - 1) * DOCUMENT_LIMIT)
        .populate({
          path: "projectId",
          model: "ProjetModel",
          populate: {
            path: "clientId",
          },
        })
        .lean();

      // if (avisClient.length < 4 && page > 1) {
      //   const limit = 4 - avisClient.length;
      //   console.log(limit);
      //   const avis = await AvisProjet.find({
      //     assistantId,
      //     visibility: "visible",
      //   })
      //     .select("-visibility")
      //     .sort({ correspondance: -1, createdAt: -1 })
      //     .skip((page - 2) * DOCUMENT_LIMIT + 4 - limit)
      //     .limit(limit)
      //     .populate({
      //       path: "projectId",
      //       model: "ProjetModel",
      //       populate: {
      //         path: "clientId",
      //       },
      //     })
      //     .lean();
      //   avisClient = [...avis, ...avisClient];
      // }

      countAvis = await AvisProjet.countDocuments({
        assistantId,
        visibility: "visible",
      });
    } else {
      avisClient = await AvisProjet.find({
        assistantId,
        visibility: "visible",
        statut: filter,
      })
        .select("-visibility")
        .sort({ correspondance: -1, createdAt: -1 })
        .limit(DOCUMENT_LIMIT)
        .skip((page - 1) * DOCUMENT_LIMIT)
        .populate({
          path: "projectId",
          model: "ProjetModel",
          populate: {
            path: "clientId",
          },
        })
        .lean();

      countAvis = await AvisProjet.countDocuments({
        assistantId,
        visibility: "visible",
        statut: filter,
      });

      // if (avisClient.length < 4 && page > 1) {
      //   const limit = 4 - avisClient.length;
      //   const avis = await AvisProjet.find({
      //     assistantId,
      //     visibility: "visible",
      //     statut: filter,
      //   })
      //     .select("-visibility")
      //     .sort({ correspondance: -1, createdAt: -1 })
      //     .skip((page - 2) * DOCUMENT_LIMIT + 4 - limit)
      //     .limit(limit)
      //     .populate({
      //       path: "projectId",
      //       model: "ProjetModel",
      //       populate: {
      //         path: "clientId",
      //       },
      //     })
      //     .lean();
      //   avisClient = [...avis, ...avisClient];
      // }
    }

    const pageNumber = Math.ceil(countAvis / DOCUMENT_LIMIT);
    const lastIndex = (countAvis % DOCUMENT_LIMIT) - 1;

    return createJsonResponse({
      avisClient,
      pageNumber,
      lastIndex: lastIndex,
    });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};
