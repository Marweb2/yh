/** @format */

import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";
import calculerPourcentageCorrespondance from "@/lib/algorithm";
import { matchNumber, perPage } from "@/lib/constants";

const isNumber = (chaine) => {
  const nombre = Number(chaine);
  return !isNaN(nombre) && isFinite(nombre);
};

export const GET = async (req, { params }) => {
  try {
    const { clientId, projectId } = params;
    const nb = req.nextUrl.searchParams.get("user");
    const page = req.nextUrl.searchParams.get("page");

    let startIndex = 0;
    if (!isEmpty(nb) && isNumber(nb)) {
      startIndex = (nb - 1) * perPage;
    }

    let user;
    let projet;
    let assistantId = [];

    if (!isValidObjectId(clientId)) {
      return new NextResponse(
        JSON.stringify({ invalidId: true }, { status: 400 })
      );
    }

    await connectToMongo();
    user = await UserModel.findById(clientId);

    // error user not found
    if (isEmpty(user)) {
      return new NextResponse(
        JSON.stringify({ userNotFound: true }, { status: 404 })
      );
    } else if (user.userType !== "client") {
      return new NextResponse(
        JSON.stringify({ invalidUserType: true }, { status: 403 })
      );
    } else if (!user.clientProjets.includes(projectId)) {
      return new NextResponse(JSON.stringify({ notYourProject: true }), {
        status: 403,
      });
    }

    projet = await ProjetModel.findById(projectId);
    if (isEmpty(projet)) {
      return new NextResponse(
        JSON.stringify({ projetNotFound: true }, { status: 404 })
      );
    }

    assistantId = projet.assistants;

    // calcul correspondance
    const users = await UserModel.find({
      userType: "assistant",
      isActive: true,
    }).select("-password -tokens -image");

    for (const u of users) {
      const correspondance = calculerPourcentageCorrespondance({
        user: u,
        projet,
      });

      const inAssistantProjets = u.assistantProjets?.find(
        (p) => p.projectId === projectId
      );

      const inAssistants = projet.assistants?.find(
        (p) => p.id === u._id.toString()
      );

      if (inAssistantProjets) {
        if (correspondance >= matchNumber) {
          await UserModel.updateOne(
            { _id: u._id, "assistantProjets.projectId": projectId },
            { $set: { "assistantProjets.$.correspondance": correspondance } }
          );
        } else {
          await UserModel.findByIdAndUpdate(u._id, {
            $pull: { assistantProjets: { projectId } },
          });
        }
      } else {
        if (correspondance >= matchNumber) {
          const assistantProjets = {
            projectId,
            correspondance,
          };

          await UserModel.findByIdAndUpdate(u._id, {
            $push: { assistantProjets },
          });
        }
      }

      if (inAssistants) {
        if (correspondance >= matchNumber) {
          await ProjetModel.updateOne(
            { _id: projectId, "assistants.id": u._id },
            { $set: { "assistants.$.correspondance": correspondance } }
          );
        } else {
          await ProjetModel.findByIdAndUpdate(projectId, {
            $pull: { assistants: { id: u._id } },
          });
        }
      } else {
        if (correspondance >= matchNumber) {
          const assistants = {
            id: u._id,
            correspondance,
          };

          await ProjetModel.findByIdAndUpdate(projectId, {
            $push: { assistants },
          });
        }
      }
    }

    const visibleAssistant = projet.assistants.filter(
      (a) => a.status === "Visible"
    );

    assistantId = visibleAssistant?.map((a) => a.id);

    const newAssistants = await UserModel.find({
      _id: { $in: assistantId },
    }).select("-password -tokens");

    // Fonction de comparaison personnalisée
    newAssistants.sort((a, b) => {
      // Recherche de l'objet où projectId est égal à 3
      const objetA = a.assistantProjets.find(
        (obj) => obj.projectId === projectId
      );
      const objetB = b.assistantProjets.find(
        (obj) => obj.projectId === projectId
      );

      // Extraction de la sous-propriété pour le tri
      const valeurA = objetA ? objetA.correspondance : 0;
      const valeurB = objetB ? objetB.correspondance : 0;

      // Tri en ordre décroissant
      return valeurB - valeurA;
    });

    // Manipuler les résultats pour prendre uniquement le premier élément de chaque tableau "image"
    let firstIndex = 0;
    let endIndex = 0;
    Array.from({ length: page }, (_, index) => (endIndex += 4));
    firstIndex = endIndex - 4;

    const assistants =
      newAssistants?.length <= 4
        ? newAssistants.map((assistant) => {
            if (!isEmpty(assistant.image) && Array.isArray(assistant.image)) {
              assistant.image = [assistant.image[0]]; // Prendre seulement le premier élément
            }
            return assistant;
          })
        : newAssistants.slice(firstIndex, endIndex).map((assistant) => {
            if (!isEmpty(assistant.image) && Array.isArray(assistant.image)) {
              assistant.image = [assistant.image[0]]; // Prendre seulement le premier élément
            }
            return assistant;
          });

    return new NextResponse(
      JSON.stringify(
        {
          assistants,
          projet,
          assistantsLength: newAssistants?.length,
        },
        { status: 200 }
      )
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
