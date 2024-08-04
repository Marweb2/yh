import { validatePassword } from "@/lib/controllers/auth.controller";
import connectToMongo from "@/lib/db";
import { createToken } from "@/lib/jwt";
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { maxAgeOneHour } from "@/lib/constants";
export const POST = async (req, { params }) => {
  try {
    let user;
    let infos;
    let token;
    let password;
    const { id } = params;
    const body = await req.json();

    if (
      isEmpty(body?.token) ||
      isEmpty(body?.password) ||
      isEmpty(id) ||
      !isValidObjectId(id)
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Data required" }, { status: 200 })
      );
    }

    const { minPasswordRegisterError } = validatePassword(body.password);

    // error newPassword < 6
    if (minPasswordRegisterError) {
      return new NextResponse(
        JSON.stringify({ minPasswordRegisterError: true }, { status: 400 })
      );
    }

    await connectToMongo();

    const salt = await bcrypt.genSalt(14);
    password = await bcrypt.hash(body.password, salt);

    user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { password },
        $pull: { tokens: body.token },
      },
      { new: true }
    ).catch((error) => console.log(error.message));

    infos = {
      passwordReset: true,
      email: user.email,
      id,
    };
    token = createToken(infos, maxAgeOneHour);

    return new NextResponse(JSON.stringify({ token }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
