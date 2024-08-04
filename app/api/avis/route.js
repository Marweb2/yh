/** @format */

import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";
import calculerPourcentageCorrespondance from "@/lib/algorithm";
import { matchNumber, perPage } from "@/lib/constants";

export const PATCH = async (req, { params }) => {
  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");
  const assistantId = searchParams.get("assistantId");
  try {
    await connectToMongo();

    const projets = await ProjetModel.findOneAndUpdate(
      {
        _id: projectId,
        status: "Visible",
        "assistants.id": assistantId,
      },
      { $set: { "assistants.$.status": "deleted" } }
    ).catch((error) => console.log(error));

    return new NextResponse(JSON.stringify({ success: true }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
