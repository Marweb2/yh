/** @format */

import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";

export const GET = async (req, { params }) => {
  try {
    const { projectId } = params;

    if (!isValidObjectId(projectId)) {
      return new NextResponse(
        JSON.stringify({ invalidId: true }, { status: 400 })
      );
    }

    await connectToMongo();

    const projet = await ProjetModel.findById(projectId).catch((error) =>
      console.log(error)
    );

    if (isEmpty(projet)) {
      return new NextResponse(JSON.stringify({ projet: [] }), {
        status: 404,
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
