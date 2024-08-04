/** @format */

import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import ProjetModel from "@/lib/models/projet.model";
import calculerPourcentageCorrespondance from "@/lib/algorithm";
import { matchNumber } from "@/lib/constants";

export const PUT = async (req, { params }) => {
  try {
    const { assistant } = params;
    let user;
    let actualProject = {};

    await connectToMongo();
    user = await UserModel.findById(assistant);

    // error user not found
    if (isEmpty(user)) {
      return new NextResponse(
        JSON.stringify({ userNotFound: true }, { status: 404 })
      );
    } else if (user.userType !== "assistant") {
      return new NextResponse(
        JSON.stringify({ invalidUserType: true }, { status: 403 })
      );
    }

    const projets = await ProjetModel.find({
      status: "Visible",
    }).catch((error) => console.log(error));

    if (isEmpty(projets)) {
      return new NextResponse(JSON.stringify({ projets: [], actualProject }), {
        status: 404,
      });
    }

    actualProject = projets[projets?.length - 1];

    // calcul correspondance

    for (const projet of projets) {
      const correspondance = calculerPourcentageCorrespondance({
        user,
        projet: projet,
      });

      const inAssistants = projet.assistants?.find(
        (p) => p.id === user._id.toString()
      );

      if (inAssistants) {
        if (correspondance >= matchNumber) {
          await ProjetModel.updateOne(
            { _id: projet._id, "assistants.id": user._id },
            { $set: { "assistants.$.correspondance": correspondance } }
          );
        } else {
          await ProjetModel.updateOne(
            { _id: projet._id },
            { $pull: { assistants: { id: user._id } } }
          );
        }
      } else {
        if (correspondance >= matchNumber) {
          const assistants = {
            id: user._id,
            correspondance,
          };

          await ProjetModel.updateOne(
            { _id: projet._id },
            { $push: { assistants } }
          );
        }
      }
    }

    return new NextResponse(JSON.stringify({ success: true }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
