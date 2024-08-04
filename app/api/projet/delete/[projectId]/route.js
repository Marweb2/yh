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
  try {
    const { clientId, projectId } = params;

    const data = await ProjetModel.findByIdAndUpdate(
      { _id: projectId },
      {
        status: "deleted",
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify(
        {
          success: true,
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
