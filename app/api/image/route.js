/** @format */
import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
import ProjetModel from "@/lib/models/projet.model";
import UserModel from "@/lib/models/user.model";

export const GET = async (req, { params }) => {
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  try {
    await connectToMongo();
    const { image } = await UserModel.findById(user).select("image");

    let img = "";

    if (image?.length > 0) {
      img = image[0];
    }

    return new NextResponse(
      JSON.stringify(
        {
          image: img,
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
