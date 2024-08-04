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
  return !isNaN(parseFloat(chaine)) && isFinite(chaine);
};

export const GET = async (req, { params }) => {
  try {
    const { clientId } = params;
    let user;
    let actualProject = {};

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
    }

    const projets = await ProjetModel.find({
      status: "Visible",
      clientId,
    }).catch((error) => console.log(error));

    if (isEmpty(projets)) {
      return new NextResponse(JSON.stringify({ projets: [], actualProject }), {
        status: 404,
      });
    }

    const projetId = projets.map((p) => ({ id: p._id, name: p.name }));

    actualProject = projets[projets?.length - 1];

    // Mettez à jour le document dans la base de données
    actualProject = await ProjetModel.findById(actualProject._id);
    const visibleAssistant = actualProject.assistants
      .filter((a) => a.status === "Visible")
      .sort((a, b) => b.correspondance - a.correspondance);

    return new NextResponse(
      JSON.stringify(
        {
          projets: projetId.reverse(),
          actualProject: { actualProject, assistants: visibleAssistant },
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
export const PATCH = async (req, { params }) => {
  try {
    const { clientId } = params;

    if (!isValidObjectId(clientId)) {
      return new NextResponse(
        JSON.stringify({ invalidId: true }, { status: 400 })
      );
    }

    await connectToMongo();

    const projets = await ProjetModel.find({
      clientId,
      status: "deleted",
    }).catch((error) => console.log(error));

    return new NextResponse(JSON.stringify({ projets }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};

export const POST = async (req, { params }) => {
  try {
    const { clientId } = params;
    const body = await req.json();
    const errors = {};

    let user;
    let projectId;
    let assistantId = [];
    let newProjet = {};

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
    }

    if (isEmpty(body)) {
      return new NextResponse(
        JSON.stringify({ error: "Data required" }, { status: 400 })
      );
    }

    // Vérification du champ "name"
    if (
      isEmpty(body?.name) ||
      body?.name?.trim()?.length < 3 ||
      body?.name?.trim()?.length > 50
    ) {
      errors.invalidName = true;
    }

    // Vérification du champ "desc"
    if (isEmpty(body?.desc) || body?.desc?.trim()?.length < 5) {
      errors.invalidDescription = true;
    }

    // Vérification du champ "budget"
    if (isEmpty(body?.statut)) {
      errors.invalidBudget = true;
    }

    // Vérification du champ "duree"
    if (isEmpty(body?.duree)) {
      errors.invalidDuration = true;
    }
    // Vérification du champ "duree"
    if (isEmpty(body?.statut)) {
      errors.statut = true;
    }

    // Vérification du champ "cmp"
    if (isEmpty(body?.competenceVirtuelle)) {
      errors.invalidCmp = true;
    }

    // Vérification du champ "app"
    if (isEmpty(body?.applicationWeb)) {
      errors.invalidApp = true;
    }

    // Vérification du champ "statut pro"
    if (isEmpty(body?.statutProfessionnelle)) {
      errors.invalidStatutPro = true;
    }

    // Vérification du champ "exp pro"
    if (isEmpty(body?.experiencePro)) {
      errors.invalidExpPro = true;
    }

    // Vérification du champ "pays"
    if (isEmpty(body?.pays)) {
      errors.invalidPays = true;
    }

    // Vérification du champ "ville"
    if (isEmpty(body?.ville)) {
      errors.invalidVille = true;
    }

    // Vérification du champ "lang"
    if (isEmpty(body?.lang)) {
      errors.invalidLang = true;
    }

    // Vérification du champ "disponibilite"
    if (isEmpty(body?.disponibilite)) {
      errors.invalidDisp = true;
    }

    // Vérification du champ "tarif"
    if (isEmpty(body?.tarif) || !isNumber(body?.tarif)) {
      errors.invalidTarif = true;
    }

    // Vérification du champ "questions"
    if (isEmpty(body?.questions)) {
      errors.missingQuestions = true;
    }

    // S'il y a des erreurs, renvoyer la réponse d'erreur
    if (Object.keys(errors)?.length > 0) {
      return new NextResponse(JSON.stringify({ errors }, { status: 400 }));
    }

    // create project
    newProjet = await ProjetModel.create({
      clientId,
      name: body.name.charAt(0).toUpperCase() + body.name.slice(1),
      desc: body.desc.charAt(0).toUpperCase() + body.desc.slice(1),
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
    }).catch((error) => console.log(error));

    projectId = newProjet._id;
    assistantId = newProjet.assistants;

    user = await UserModel.findByIdAndUpdate(
      clientId,
      {
        $push: {
          clientProjets: {
            $each: [projectId],
            $position: 0,
          },
        },
      },
      { new: true }
    );

    // calcul correspondance
    const users = await UserModel.find({
      userType: "assistant",
      isActive: true,
    }).select("-password -tokens -image");

    for (const u of users) {
      const correspondance = calculerPourcentageCorrespondance({
        user: u,
        projet: newProjet,
      });

      if (correspondance >= matchNumber) {
        const assistantProjets = {
          projectId,
          correspondance,
        };
        const assistants = {
          id: u._id,
          correspondance,
        };

        await UserModel.updateOne(
          { _id: u._id },
          { $push: { assistantProjets } }
        );

        await ProjetModel.updateOne(
          { _id: projectId },
          { $push: { assistants } }
        );
      }
    }

    newProjet = await ProjetModel.findById(projectId);

    assistantId = newProjet.assistants?.map((a) => a.id).slice(0, perPage);

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
    const assistants = newAssistants.map((assistant) => {
      if (!isEmpty(assistant.image) && Array.isArray(assistant.image)) {
        assistant.image = [assistant.image[0]]; // Prendre seulement le premier élément
      }

      return assistant;
    });

    const projetId = { id: newProjet._id, name: newProjet.name };

    return new NextResponse(
      JSON.stringify(
        { assistants, actualProject: newProjet, projetId },
        { status: 200 }
      )
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
