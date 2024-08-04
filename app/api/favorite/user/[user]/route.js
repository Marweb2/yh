/** @format */
import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";
import UserModel from "@/lib/models/user.model";
import FavoritesModel from "@/lib/models/favorites.model";

export const GET = async (req, { params }) => {
  try {
    const { user } = params;
    await connectToMongo();
    const data = await FavoritesModel.findOne({ client: user });

    return new NextResponse(
      JSON.stringify(
        {
          data,
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
  const { user } = params;
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");
  const username = searchParams.get("username");
  const correspondance = searchParams.get("correspondance");
  const statutProfessionnelle = searchParams.get("statut");
  const ProjectName = searchParams.get("project");
  const favorisId = searchParams.get("id");

  const date = new Date().toLocaleString()?.split(" ");

  await connectToMongo();
  try {
    const verifyFavouriteModelExists = await FavoritesModel.findOne({
      client: user,
    });
    if (!verifyFavouriteModelExists) {
      await FavoritesModel.create({ client: user });
    }
    const data = await FavoritesModel.updateOne(
      { client: user },
      {
        $push: {
          assistants: {
            correspondance,
            name,
            username,
            statutProfessionnelle,
            ProjectName,
            date: `${date[0]} - ${date[1].slice(0, 5)}`,
            assistant: favorisId,
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
  const { user } = params;
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  await connectToMongo();
  try {
    const data = await FavoritesModel.updateOne(
      { client: user },
      {
        $pull: {
          assistants: {
            assistant: id,
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
