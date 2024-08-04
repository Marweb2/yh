/** @format */

import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "@/lib/db";
import ProjetModel from "@/lib/models/projet.model";
import FavoritesModel from "@/lib/models/favorites.model";

export const GET = async (req, { params }) => {
  const { userId } = params;

  await connectToMongo();
  try {
    const data = await FavoritesModel.findOne({ client: userId }).select(
      "assistants"
    );

    const searchParams = req.nextUrl.searchParams;
    const assistant = searchParams.get("assistant");
    const projectName = searchParams.get("projectName");
    for (const i in data.assistants) {
      if (
        data.assistants[i].assistant == assistant &&
        projectName === data.assistants[i].data.ProjectName
      ) {
        return new NextResponse(JSON.stringify({ isFavourite: true }), {
          status: 200,
        });
      }
    }
    return new NextResponse(JSON.stringify({ isFavourite: false }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
