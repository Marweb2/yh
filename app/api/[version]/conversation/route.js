/** @format */

import { getClientId, getAvisId } from "@/lib/function";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import UserModel from "@/lib/models/user.model";
import ClientFavorite from "@/lib/models/favorite-client-model-final";
import ConversationModel from "@/lib/models/conversation-model-final";
import AssistantFavorite from "@/lib/models/favorite-assistant-model-final";
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

export const GET = async (req, { params }) => {
  try {
    const clientId = getClientId(req);
    const userId = req.nextUrl.searchParams.get("user") ?? "";
    const userType = req.nextUrl.searchParams.get("type") ?? "";
    const page = req.nextUrl.searchParams.get("page") ?? "";
    const projectId = req.nextUrl.searchParams.get("project") ?? "";

    const user = await validateUserId(userId);

    if (userType === "client") {
      if (page === "mes-projets") {
        const conversation = await ConversationModel.find({
          $or: [
            {
              client: user,
              projectId,
            },
            {
              assistant: user,
              projectId,
            },
          ],
          deletedByClient: false,
        })
          .sort({ updatedAt: -1 })
          .populate([
            {
              path: "avisId",
              model: "AvisProjet",
              populate: [
                {
                  path: "assistantId",
                },
                {
                  path: "projectId",
                },
              ],
            },
          ])
          .lean();

        const conv = conversation.map(async (u) => {
          let conv = null;
          conv = await ClientFavorite.findOne({
            avisId: u.avisId?._id,
            client: userId,
            projectId: u.avisId?.projectId,
          }).lean();
          return {
            ...u,
            favoris: conv,
          };
        });

        const promise = await Promise.all(conv);

        let notViewedConversation;

        if (user.lastConversationViewedTime) {
          notViewedConversation = await ConversationModel.countDocuments({
            viewedByClient: false,
            client: user,
            modifiedByClient: {
              $gt: user.lastConversationViewedTime,
            },
            deletedByClient: false,
          });
        } else {
          notViewedConversation = await ConversationModel.countDocuments({
            viewedByAssistant: false,
            client: user,
          });
        }

        return createJsonResponse({
          conversation: promise.filter((a) => a.favoris === null),
          notViewedConversation,
        });
      } else {
        const conversation = await ConversationModel.find({
          $or: [
            {
              client: user,
            },
            {
              assistant: user,
            },
          ],
          deletedByClient: false,
        })
          .sort({ updatedAt: -1 })
          .populate([
            {
              path: "avisId",
              model: "AvisProjet",
              populate: [
                {
                  path: "assistantId",
                },
                {
                  path: "projectId",
                },
              ],
            },
          ])
          .lean();

        const conv = conversation.map(async (u) => {
          let conv = null;
          conv = await ClientFavorite.findOne({
            avisId: u.avisId?._id,
            client: userId,
            projectId: u.avisId?.projectId,
          }).lean();
          return {
            ...u,
            favoris: conv,
          };
        });

        const promise = await Promise.all(conv);

        let notViewedConversation;

        if (user.lastConversationViewedTime) {
          notViewedConversation = await ConversationModel.countDocuments({
            viewedByClient: false,
            client: user,
            modifiedByClient: {
              $gt: user.lastConversationViewedTime,
            },
            deletedByClient: false,
          });
        } else {
          notViewedConversation = await ConversationModel.countDocuments({
            viewedByAssistant: false,
            client: user,
          });
        }

        return createJsonResponse({
          conversation: promise.filter((a) => a.favoris === null),
          notViewedConversation,
        });
      }
    } else {
      if (page === "mes-projets") {
        let projectIds = await AvisProjet.find({
          assistantId: userId,
          visibility: "visible",
          assistant_choice: "interested",
        }).select("projectId");

        projectIds = projectIds.map((a) => a.projectId);
        const conversation = await ConversationModel.find({
          $or: [
            {
              client: user,
              projectId: {
                $in: projectIds,
              },
            },
            {
              assistant: user,
              projectId: {
                $in: projectIds,
              },
            },
          ],
          deletedByAssistant: false,
        })
          .sort({ updatedAt: -1 })
          .populate([
            {
              path: "avisId",
              model: "AvisProjet",
              populate: [
                {
                  path: "assistantId",
                },
                {
                  path: "projectId",
                  populate: {
                    path: "clientId",
                  },
                },
              ],
            },
          ])
          .lean();

        return createJsonResponse({ conversation });
      } else {
        const conversation = await ConversationModel.find({
          $or: [
            {
              client: user,
            },
            {
              assistant: user,
            },
          ],
          deletedByAssistant: false,
        })
          .sort({ updatedAt: -1 })
          .populate([
            {
              path: "avisId",
              model: "AvisProjet",
              populate: [
                {
                  path: "assistantId",
                },
                {
                  path: "projectId",
                  populate: {
                    path: "clientId",
                  },
                },
              ],
            },
          ])
          .lean();

        const conv = conversation.map(async (u) => {
          let conv = null;
          conv = await AssistantFavorite.findOne({
            avisId: u.avisId?._id,
            assistantId: userId,
          }).lean();
          return {
            ...u,
            favoris: conv,
          };
        });

        const promise = await Promise.all(conv);

        let notViewedConversation;
        if (user.lastConversationViewedTime) {
          notViewedConversation = await ConversationModel.countDocuments({
            viewedByAssistant: false,
            assistant: user,
            modifiedByAssistant: {
              $gt: user.lastConversationViewedTime,
            },
            deletedByAssistant: false,
          });
        } else {
          notViewedConversation = await ConversationModel.countDocuments({
            viewedByAssistant: false,
            assistant: user,
          });
        }

        return createJsonResponse({
          conversation: promise.filter((a) => a.favoris === null),
          notViewedConversation,
        });
      }
    }
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    const userId = req.nextUrl.searchParams.get("user") ?? "";
    const userType = req.nextUrl.searchParams.get("type") ?? "";
    const convId = req.nextUrl.searchParams.get("conversation") ?? "";

    const user = await validateUserId(userId);
    let conv;
    if (userType === "client") {
      conv = await ConversationModel.findOneAndUpdate(
        {
          _id: convId,
        },
        {
          deletedByClient: true,
        },
        {
          new: true,
        }
      );
    } else {
      conv = await ConversationModel.findOneAndUpdate(
        {
          _id: convId,
        },
        {
          deletedByAssistant: true,
        },
        {
          new: true,
        }
      );
    }

    return createJsonResponse({ deleted: true });
  } catch (err) {
    return createErrorResponse({ error: err.message });
  }
};
