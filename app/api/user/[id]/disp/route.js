import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  try {
    let user;
    const { id } = params;
    const body = await req.json();
    let res = {};

    // req.headers.get("cookie");
    if (
      isEmpty(id) ||
      !isValidObjectId(id) ||
      isEmpty(body) ||
      (body?.note === undefined && body?.disponibilite === undefined)
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Data required" }, { status: 400 })
      );
    }

    await connectToMongo();
    user = await UserModel.findById(id);

    // error user not found
    if (isEmpty(user))
      return new NextResponse(
        JSON.stringify({ userNotFound: true }, { status: 404 })
      );

    const userInfosToUpdate = {
      $set: {},
    };

    for (const key in body) {
      const value = body[key];
      if (key && value !== undefined) {
        userInfosToUpdate.$set[key] = value;
      }
    }

    user = await UserModel.findByIdAndUpdate(id, userInfosToUpdate, {
      new: true,
    });

    for (const key in body) {
      if (body[key] !== undefined) {
        res[key] = user[key];
      }
    }

    return new NextResponse(JSON.stringify({ user: res }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
