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

export const GET = async (req, { params }) => {
  try {
    const userId = req.nextUrl.searchParams.get("client");

    await validateUserId(userId);

    const projets = await ProjetModel.find({
      isVisible: true,
      clientId: userId,
      // $or: [
      //   {
      //     deletedByClient: false,
      //   },
      //   {
      //     deletedByClient: null,
      //   },
      // ],
      deletedByClient: false,
    })
      .select("name _id")
      .sort({ createdAt: -1 });

    if (isEmpty(projets)) {
      return createJsonResponse({ projets: [], actualProject: {} });
    }

    const actualProjectId = projets[0];
    const actualProject = await ProjetModel.findById(
      actualProjectId._id
    ).select("-isVisible");

    const countAvis = await AvisProjet.countDocuments({
      projectId: actualProjectId,
      visibility: "visible",
    });
    const pageLength = Math.ceil(countAvis / AVIS_PER_PAGE);

    return createJsonResponse({
      projets: projets,
      actualProject,
      pageLength,
    });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};

export const POST = async (req, { params }) => {
  try {
    const client = req.nextUrl.searchParams.get("client");
    const body = await req.json();

    if (!isValidObjectId(client)) {
      return createErrorResponse("Invalid ID", 400);
    }

    await connectToMongo();
    const user = await UserModel.findById(client);

    if (isEmpty(user)) {
      return createErrorResponse("User not found", 404);
    }

    if (user.userType !== "client") {
      return createErrorResponse("Invalid user type", 403);
    }

    if (isEmpty(body)) {
      return createErrorResponse("Data required", 400);
    }

    const newProjet = await ProjetModel.create({
      clientId: client,
      name: body.name,
      desc: body.desc,
      statut: body.statut,
      duree: body.duree,
      competenceVirtuelle: body.competenceVirtuelle,
      applicationWeb: body.applicationWeb,
      statutProfessionnelle: body.statutProfessionnelle,
      experiencePro: body.experiencePro,
      pays: body.pays,
      ville: body.ville,
      province: body?.province,
      lang: body.lang,
      delai: body.delai,
      disponibilite: body.disponibilite,
      tarif: body.tarif,
      uniteMonaitaire: body?.uniteMonaitaire,
      montantForfaitaire: body?.montantForfaitaire,
      benevolat: body?.benevolat,
      questions: body.questions,
    });

    const assistants = await UserModel.find({
      userType: "assistant",
      isActive: true,
    }).select("-password -tokens -image");

    const avisProjets = assistants.map(async (u) => {
      const correspondance = calculerPourcentageCorrespondance({
        user: u,
        projet: newProjet,
      });

      if (correspondance >= matchNumber) {
        const data = await AvisProjet.findOne({
          projectId: newProjet._id,
          assistantId: u._id,
        });
        const maintenant = new Date();

        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const dateHeureFormattee = new Intl.DateTimeFormat(
          "fr-FR",
          options
        ).format(maintenant);
        if (!data) {
          await AvisProjet.create({
            projectId: newProjet._id,
            assistantId: u._id,
            correspondance: Math.floor(correspondance * 100),
            dateString: dateHeureFormattee,
            isNewAvisForAssistant: true,
          });
        }
      }
    });

    await Promise.all(avisProjets);

    return createJsonResponse({ created: true, actualProject: newProjet });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
export const PATCH = async (req, { params }) => {
  try {
    const maintenant = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const dateHeureFormattee = new Intl.DateTimeFormat("fr-FR", options).format(
      maintenant
    );
    const data = await ProjetModel.updateMany(
      {},
      { deletedByClient: false },
      { new: true }
    );

    await AvisProjet.updateMany({}, { visibilityInAssistant: "visible" });
    return createJsonResponse({ updated: true, data });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
};
