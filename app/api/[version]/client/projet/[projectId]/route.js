/** @format */

import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet-model-final";
import UserModel from "@/lib/models/user.model";
import calculerPourcentageCorrespondance from "@/lib/algorithm";
import AvisProjet from "@/lib/models/avis-projet-model-final";
import { matchNumber } from "@/lib/constants";
import ConversationModel from "@/lib/models/conversation-model-final";
import ClientFavorite from "@/lib/models/favorite-client-model-final";
import AssistantFavorite from "@/lib/models/favorite-assistant-model-final";

export const GET = async (req, { params }) => {
  try {
    const { projectId } = params;

    if (!isValidObjectId(projectId)) {
      return new NextResponse(
        JSON.stringify({ invalidId: true }, { status: 400 })
      );
    }

    await connectToMongo();

    const projet = await ProjetModel.findById(projectId).catch((error) => {
      throw new Error(error);
    });

    if (isEmpty(projet)) {
      return new NextResponse(JSON.stringify({ projet: {} }), {
        status: 200,
      });
    }
    return new NextResponse(
      JSON.stringify(
        {
          projet,
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
    const { projectId } = params;
    let newProjectGenerated = 0;
    const body = await req.json();

    if (!isValidObjectId(projectId)) {
      return new NextResponse(
        JSON.stringify({ invalidId: true }, { status: 400 })
      );
    }

    await connectToMongo();

    const projet = await ProjetModel.findByIdAndUpdate(
      projectId,
      { ...body, isClosed: false },
      { new: true }
    );

    const assistants = await UserModel.find({
      userType: "assistant",
      isActive: true,
    }).select("-password -tokens -image");

    const avisProjets = assistants.map(async (u) => {
      const correspondance = calculerPourcentageCorrespondance({
        user: u,
        projet: projet,
      });

      if (correspondance >= matchNumber) {
        const data = await AvisProjet.findOne({
          projectId: projet._id,
          assistantId: u._id,
        });

        if (!data) {
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
          await AvisProjet.create({
            projectId: projet._id,
            assistantId: u._id,
            correspondance: Math.floor(correspondance * 100),
            dateString: dateHeureFormattee,
            isNewAvis: true,
            isNewAvisForAssistant: true,
          });
          newProjectGenerated++;
        } else if (data?.correspondance < correspondance) {
          await AvisProjet.findOneAndUpdate(
            { projectId: projet._id, assistantId: u._id },
            { correspondance: Math.floor(correspondance * 100), isNew: false }
          );
        }
      }
    });

    await Promise.all(avisProjets);

    return new NextResponse(
      JSON.stringify(
        {
          projet,
          newProjectGenerated,
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

export const DELETE = async (req, { params }) => {
  try {
    const { projectId } = params;

    if (!isValidObjectId(projectId)) {
      return new NextResponse(
        JSON.stringify({ invalidId: true }, { status: 400 })
      );
    }

    await connectToMongo();

    await ProjetModel.findOneAndUpdate(
      { _id: projectId },
      { deletedByClient: true }
    );

    // const avis = await AvisProjet.find({ projectId }).select("_id");
    // const avisIds = avis.map((a) => a._id);
    // await AvisProjet.findOneAndDelete({ projectId });
    // await ConversationModel.findOneAndDelete({ projectId });
    // await ClientFavorite.deleteMany({
    //   avisId: {
    //     $in: avisIds,
    //   },
    // });
    // await AssistantFavorite.deleteMany({
    //   avisId: {
    //     $in: avisIds,
    //   },
    // });

    return new NextResponse(
      JSON.stringify(
        {
          deleted: true,
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
