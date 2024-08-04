/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import ProjetModel from "@/lib/models/projet.model";

export const GET = async (req, { params }) => {
  const { clientId } = params;

  try {
    await connectToMongo();

    const user = await UserModel.findOne({
      _id: clientId,
      userType: "client",
    }).select("name username image disponibilite");

    return new NextResponse(JSON.stringify({ user }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
