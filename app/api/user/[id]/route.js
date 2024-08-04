/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import favoriteModel from "@/lib/models/favorites.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import ProjetModel from "@/lib/models/projet-model-final";
import calculerPourcentageCorrespondance from "@/lib/algorithm";
import AvisProjet from "@/lib/models/avis-projet-model-final";
import { matchNumber } from "@/lib/constants";

export const GET = async (req, { params }) => {
  try {
    let user;
    const { id } = params;
    await connectToMongo();

    if (!isValidObjectId(id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID" }, { status: 404 })
      );
    }

    user = await UserModel.findById(id);

    // error user not found
    if (isEmpty(user))
      return new NextResponse(
        JSON.stringify({ error: "Aucun utilisateur trouvé" }, { status: 404 })
      );

    const { password, tokens, isAdmin, image, ...userInfos } = Object.assign(
      {},
      user.toJSON()
    );

    return new NextResponse(
      JSON.stringify(
        {
          user: {
            ...userInfos,
            image: user?.image && user.image[0] ? [user.image[0]] : [],
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

export const PUT = async (req, { params }) => {
  try {
    let user;
    const { id } = params;
    if (!isValidObjectId(id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID" }, { status: 404 })
      );
    }
    await connectToMongo();
    user = await UserModel.findById(id);
    if (!user)
      return new NextResponse(
        JSON.stringify({ error: "Aucun utilisateur trouvé" }, { status: 404 })
      );
    const infos = await req.json();
    if (isEmpty(infos)) {
      return new NextResponse(
        JSON.stringify({ error: "Required" }, { status: 400 })
      );
    }
    const userInfosToUpdate = {
      $set: {},
    };

    for (const key in infos) {
      const value = infos[key];
      if (key && value !== undefined) {
        if (key === "username") {
          const usn = value.charAt(0).toUpperCase() + value.slice(1);
          userInfosToUpdate.$set[key] = usn;
        } else {
          userInfosToUpdate.$set[key] = value;
        }
      }
    }
    user = await UserModel.findByIdAndUpdate(id, userInfosToUpdate, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }).catch((err) => {
      return new NextResponse(
        JSON.stringify({ error: err.message }, { status: 500 })
      );
    });

    if (user.userType === "assistant") {
      const projects = await ProjetModel.find({
        isVisible: true,
      });
      const avisProjects = projects.map(async (u) => {
        const correspondance = calculerPourcentageCorrespondance({
          user,
          projet: u,
        });
        if (correspondance >= matchNumber) {
          return AvisProjet.findOneAndUpdate(
            {
              projectId: u._id,
              assistantId: user._id,
            },
            {
              correspondance: Math.floor(correspondance * 100),
              projectId: u._id,
              assistantId: user._id,
            },
            {
              upsert: true,
            }
          );
        }
      });

      await Promise.all(avisProjects);
    }
    const { password, tokens, isAdmin, image, ...userInfos } = Object.assign(
      {},
      user.toJSON()
    );
    return new NextResponse(
      JSON.stringify(
        {
          user: {
            ...userInfos,
            image: user?.image && user.image[0] ? [user.image[0]] : [],
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

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    if (!isValidObjectId(id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID" }, { status: 404 })
      );
    }
    await connectToMongo();
    const user = await UserModel.updateMany({}, { $set: { tokens: [] } });

    // const user = await UserModel.findByIdAndDelete(id);
    // const user = await UserModel.findByIdAndUpdate(
    //   id,
    //   { $set: { isActive: false } },
    //   { new: true }
    // );
    if (!user)
      return new NextResponse(
        JSON.stringify({ error: "Aucun utilisateur trouvé" }, { status: 404 })
      );
    return new NextResponse(JSON.stringify(user, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
