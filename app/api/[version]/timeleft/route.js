/** @format */

import { NextResponse } from "next/server";
import { isEmpty } from "@/lib/utils/isEmpty";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet-model-final";

export const GET = async (req, { params }) => {
  try {
    // Extraire projectId des paramètres de la requête
    const projectId = req.nextUrl.searchParams.get("project");

    console.log("ID du projet reçu :", projectId);

    // Vérifier si projectId est un ObjectId MongoDB valide
    if (!isValidObjectId(projectId)) {
      console.log("ObjectId invalide :", projectId);
      return new NextResponse(JSON.stringify({ invalidId: true }), {
        status: 400,
      });
    }

    // Se connecter à MongoDB
    await connectToMongo();

    // Trouver le projet par son ID
    const projet = await ProjetModel.findOne({ _id: projectId }).catch(
      (error) => {
        console.error("Erreur lors de la recherche du projet :", error);
        throw new Error("Erreur lors de la recherche du projet");
      }
    );

    // Logger le projet et son champ delai
    if (projet) {
      console.log("Projet trouvé :", projet);
      console.log("Délai du projet :", projet.delai);
    } else {
      console.log("Projet non trouvé pour l'ID :", projectId);
    }

    // Vérifier si le projet a été trouvé et retourner un statut 404 sinon
    if (isEmpty(projet)) {
      return new NextResponse(JSON.stringify({ projet: [] }), {
        status: 404,
      });
    }

    // Calculer le temps écoulé depuis la création du projet en millisecondes
    const createdAt = new Date(projet.createdAt).getTime();
    const currentDate = new Date().getTime();
    const elapsedMilliseconds = currentDate - createdAt;

    // Convertir les millisecondes écoulées en heures
    const elapsedHours = Math.ceil(elapsedMilliseconds / (1000 * 60 * 60));

    // Calculer le délai restant en heures
    const delaiHours = Math.min(projet.delai, 3 * 24); // Limite à 3 jours (72 heures)
    const remainingHours = delaiHours - elapsedHours;

    // Initialiser les jours et les heures restants
    let remainingDays = 0;
    let remainingHoursWithinDay = 0;

    // Vérifier s'il reste du temps
    if (remainingHours > 0) {
      // Calculer les jours et les heures restants
      if (remainingHours >= 24) {
        remainingDays = Math.floor(remainingHours / 24);
        remainingHoursWithinDay = remainingHours % 24;
      } else {
        remainingHoursWithinDay = remainingHours;
      }
    }

    // Retourner le projet trouvé avec le délai restant et un statut 200
    return new NextResponse(
      JSON.stringify({
        remainingDelai: {
          days: remainingDays,
          hours: remainingHoursWithinDay,
          text: `${remainingDays}j ${remainingHoursWithinDay}h`,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    // Gérer toutes les erreurs qui se produisent
    console.error("Erreur dans GET /api/timeleft:", err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
