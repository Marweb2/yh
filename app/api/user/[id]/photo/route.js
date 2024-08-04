import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { id } = params;

    if (isEmpty(id) || !isValidObjectId(id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID" }, { status: 400 })
      );
    }

    await connectToMongo();
    const user = await UserModel.findById(id);

    // error user not found
    if (isEmpty(user))
      return new NextResponse(
        JSON.stringify({ userNotFound: true }, { status: 404 })
      );
    return new NextResponse(
      JSON.stringify({ image: user.image }, { status: 200 })
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
