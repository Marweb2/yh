import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";
import ProjetModel from "@/lib/models/projet.model";
import UserModel from "@/lib/models/user.model";

export const GET = async (req) => {
  try {
    await connectToMongo();
    const projets = await ProjetModel.find();
    return new NextResponse(JSON.stringify({ projets }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
