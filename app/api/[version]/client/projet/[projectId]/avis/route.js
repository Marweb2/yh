/** @format */

import ProjetModel from "@/lib/models/projet-model-final";
import AvisProjet from "@/lib/models/avis-projet-model-final";
import { getClientId, getProjectId } from "@/lib/function";
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
    const projectId = getProjectId(params);
    const clientId = getClientId(req);
    const pageNumber = getPageNumber(req);
    const filter = req.nextUrl.searchParams.get("filter");

    if (!pageNumber) {
      return createErrorResponse("page must be a number greater than 0", 400);
    }
    if (!filter) {
      return createErrorResponse("filter is required ", 400);
    } else if (
      filter !== "interested" &&
      filter !== "not_interested" &&
      filter !== "all" &&
      filter !== "responded"
    ) {
      return createErrorResponse(
        "filter must be 'all', 'interested' , 'not_interested' or 'responded' ",
        400
      );
    }

    await validateUserId(clientId);

    let projet = await ProjetModel.findById(projectId).select("-isVisible");

    if (isEmpty(projet)) {
      return createErrorResponse({ projectNotFound: true }, 400);
    }
    if (!projet.isClosed && projet.delai) {
      const projectCreation = projet.createdAt;
      const date = new Date();
      const isoStringNow = date.toISOString();

      const now = new Date(isoStringNow);
      now.setDate(now.getDate() - projet.delai / 24);
      const iso2 = now.toISOString();

      const creationDate = new Date(projectCreation);
      const date2 = new Date(iso2);

      if (creationDate < date2) {
        projet = await ProjetModel.findOneAndUpdate(
          { _id: projectId },
          { isClosed: true },
          { new: true }
        );
      }
    }

    let avisProjet;
    let countAvis;

    if (filter === "all") {
      avisProjet = await AvisProjet.find({
        projectId,
        visibility: "visible",
      })
        .select("-visibility")
        .populate([
          {
            path: "assistantId",
          },
        ])
        .sort({
          correspondance: -1,
          createdAt: -1,
        })
        .limit(DOCUMENT_LIMIT)
        .skip((pageNumber - 1) * DOCUMENT_LIMIT)
        .lean();

      // if (avisProjet.length < 4 && pageNumber > 1) {
      //   const limit = 4 - avisProjet.length;
      //   const avis = await AvisProjet.find({
      //     projectId,
      //     visibility: "visible",
      //   })
      //     .select("-visibility")
      //     .populate([
      //       {
      //         path: "assistantId",
      //       },
      //     ])
      //     .sort({
      //       correspondance: -1,
      //       createdAt: -1,
      //     })
      //     // .skip(3)
      //     // .limit(limit)
      //     .limit(limit)
      //     .skip((pageNumber - 2) * DOCUMENT_LIMIT + 4 - limit)
      //     .lean();
      //   avisProjet = [...avis, ...avisProjet];
      // }

      countAvis = await AvisProjet.countDocuments({
        projectId,
        visibility: "visible",
      });
    } else if (filter === "interested" || filter === "not_interested") {
      avisProjet = await AvisProjet.find({
        projectId,
        visibility: "visible",
        assistant_choice: filter,
      })
        .select("-visibility")
        .populate([
          {
            path: "assistantId",
          },
        ])
        .sort({
          correspondance: -1,
          createdAt: -1,
        })
        .limit(DOCUMENT_LIMIT)
        .skip((pageNumber - 1) * DOCUMENT_LIMIT)
        .lean();
      countAvis = await AvisProjet.countDocuments({
        projectId,
        visibility: "visible",
        assistant_choice: filter,
      });

      // if (avisProjet.length < 4 && pageNumber > 1) {
      //   const limit = 4 - avisProjet.length;
      //   const avis = await AvisProjet.find({
      //     projectId,
      //     visibility: "visible",
      //     assistant_choice: filter,
      //   })
      //     .select("-visibility")
      //     .populate([
      //       {
      //         path: "assistantId",
      //       },
      //     ])
      //     .sort({
      //       correspondance: -1,
      //       createdAt: -1,
      //     })
      //     .skip((pageNumber - 2) * DOCUMENT_LIMIT + 4 - limit)
      //     .limit(limit)
      //     .lean();
      //   avisProjet = [...avis, ...avisProjet];
      // }
    } else if (filter === "responded") {
      avisProjet = await AvisProjet.find({
        projectId,
        visibility: "visible",
        there_is_response: true,
      })
        .select("-visibility")
        .populate([
          {
            path: "assistantId",
          },
        ])
        .sort({
          correspondance: -1,
          createdAt: -1,
        })
        .limit(DOCUMENT_LIMIT)
        .skip((pageNumber - 1) * DOCUMENT_LIMIT)
        .lean();
      countAvis = await AvisProjet.countDocuments({
        projectId,
        visibility: "visible",
        there_is_response: true,
      });

      // if (avisProjet.length < 4 && pageNumber > 1) {
      //   const limit = 4 - avisProjet.length;
      //   const avis = await AvisProjet.find({
      //     projectId,
      //     visibility: "visible",
      //     there_is_response: true,
      //   })
      //     .select("-visibility")
      //     .populate([
      //       {
      //         path: "assistantId",
      //       },
      //     ])
      //     .sort({
      //       correspondance: -1,
      //       createdAt: -1,
      //     })
      //     .skip((pageNumber - 2) * DOCUMENT_LIMIT + 4 - limit)
      //     .limit(limit)
      //     .lean();
      //   avisProjet = [...avis, ...avisProjet];
      // }
    }

    return createJsonResponse({
      assistants: avisProjet,
      projet,
      assistantsLength: countAvis,
    });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};
