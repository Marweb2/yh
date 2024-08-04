/** @format */

import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";
import UserModel from "@/lib/models/user.model";

export const GET = async (req, { params }) => {
  try {
    const { project } = params;
    let favorites = [];
    await connectToMongo();
    const data = await ProjetModel.findById(project).select(
      "assistantsFavorite"
    );

    for (let i in data.assistantsFavorite) {
      const assistant = await UserModel.findById(
        data.assistantsFavorite[i].id
      ).select("username name statutProfessionnelle image");
      favorites = [
        ...favorites,
        {
          name: assistant.name,
          username: assistant.username,
          correspondance: data.assistantsFavorite[i].correspondance,
          date: data.assistantsFavorite[i].date,
          statutProfessionnelle: assistant.statutProfessionnelle,
          image: assistant.image[0],
          id: assistant._id,
        },
      ];
    }
    return new NextResponse(
      JSON.stringify(
        {
          favorites,
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
  const { project } = params;
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const correspondance = searchParams.get("correspondance");

  const date = new Date().toLocaleString()?.split(" ");

  await connectToMongo();
  try {
    const data = await ProjetModel.updateOne(
      { _id: project },
      {
        $push: {
          assistantsFavorite: {
            correspondance,
            id,
            date: `${date[0]} - ${date[1].slice(0, 5)}`,
          },
        },
      }
    );

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const DELETE = async (req, { params }) => {
  const { project } = params;
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  await connectToMongo();
  try {
    const data = await ProjetModel.updateOne(
      { _id: project },
      {
        $pull: {
          assistantsFavorite: {
            id,
          },
        },
      }
    );

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
