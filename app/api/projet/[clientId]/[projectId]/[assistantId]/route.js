import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";

export const GET = async (req, { params }) => {
  try {
    const { clientId, projectId, assistantId } = params;

    let user;
    let projet;
    let assistant;

    if (
      !isValidObjectId(clientId) ||
      !isValidObjectId(projectId) ||
      !isValidObjectId(assistantId)
    ) {
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

    assistant = await UserModel.findById(assistantId);
    if (
      isEmpty(assistant) ||
      assistant?.userType !== "assistant" ||
      !assistant?.isActive
    ) {
      return new NextResponse(
        JSON.stringify({ assistantNotFound: true }, { status: 404 })
      );
    }
    const { password, tokens, isAdmin, image, ...userInfos } = Object.assign(
      {},
      assistant.toJSON()
    );

    return new NextResponse(
      JSON.stringify(
        {
          assistant: {
            ...userInfos,
            image:
              assistant?.image && assistant.image[0]
                ? [assistant.image[0]]
                : [],
          },
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
