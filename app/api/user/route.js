/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToMongo();
    const tokens = [];
    const users = await UserModel.find().select("_id tokens email");
    // const users = await UserModel.updateMany(
    //   {},
    //   { $set: tokens },
    //   { new: true }
    // );

    // error users not found
    if (!users)
      return new NextResponse(
        JSON.stringify({ error: "Aucun utilisateur trouvé" }, { status: 404 })
      );

    return new NextResponse(JSON.stringify(users, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};

export const POST = async (req) => {
  try {
    await connectToMongo();
    const { id } = await req.json();
    const users = await UserModel.find().select("-password -image -tokens");
    // const users = await UserModel.findByIdAndDelete(id);
    if (!users)
      return new NextResponse(
        JSON.stringify({ error: "Aucun utilisateur trouvé" }, { status: 404 })
      );
    return new NextResponse(JSON.stringify(users, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
