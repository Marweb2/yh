/** @format */

import { getClientId, getAvisId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import ClientFavorite from "@/lib/models/favorite-client-model-final";
import AvisProjet from "@/lib/models/avis-projet-model-final";
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
    const clientId = getClientId(req);

    await validateUserId(clientId);

    const favoris = await ClientFavorite.find({
      clientId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "avisId",
        select: "-visibility -createdAt -updatedAt",
        populate: [
          {
            path: "projectId",
            model: "ProjetModel",
            select: "-isVisible",
          },
          {
            path: "assistantId",
            select:
              " -isActive -email -isAdmin -avis -assistantProjets -tokens -createdAt -updatedAt -__v -userType -clientProjets -anciensClientProjets -password",
          },
        ],
      })
      .select("-clientId")
      .lean();

    const conv = favoris.map(async (u) => {
      const conv = await ConversationModel.findOne({
        avisId: u.avisId?._id,
        client: clientId,
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
    return createErrorResponse({ error: err.message });
  }
};

export const POST = async (req, { params }) => {
  try {
    const body = await req.json();

    if (isEmpty(body)) {
      return createErrorResponse("Data required", 400);
    }
    await validateUserId(body?.clientId);

    if (!isValidObjectId(body?.avisId)) {
      return createErrorResponse("Avis must be a valid objectId", 400);
    }

    const isFavoriteAlreadyExists = await ClientFavorite.findOne({
      clientId: body?.clientId,
      avisId: body?.avisId,
    });

    if (isFavoriteAlreadyExists) {
      return createErrorResponse("this favorite already exists", 400);
    }

    const favorite = await ClientFavorite.create({
      clientId: body?.clientId,
      avisId: body?.avisId,
      conversationId: body?.conversationId ?? null,
    });

    return createJsonResponse({ created: true, favorite });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const clientId = getClientId(req);
    const avisId = getAvisId(req);

    await validateUserId(clientId);

    if (!isValidObjectId(avisId)) {
      return createErrorResponse("Avis must be a valid objectId", 400);
    }

    const avis = await AvisProjet.findById(avisId);

    await ClientFavorite.deleteOne({
      clientId,
      avisId,
    });

    return createJsonResponse({ deleted: true });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
