import { authTokenName, cookieName } from "@/lib/constants";
import connectToMongo from "@/lib/db";
import { decodeToken, verifyToken } from "@/lib/jwt";
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
export const GET = async (req, { params }) => {
  try {
    let user;
    let res;
    let verify;
    const { token } = params;

    if (isEmpty(token)) {
      return new NextResponse(
        JSON.stringify({ error: "No token" }, { status: 200 })
      );
    }

    verify = verifyToken(token);

    if (isEmpty(verify?.infos)) {
      if (verify.name === "TokenExpiredError") {
        verify = decodeToken(token);
      } else {
        res = new NextResponse(
          JSON.stringify({ error: "Invalid token" }, { status: 400 })
        );
        res.cookies.set(cookieName, "", { maxAge: -1 });
        return res;
      }
    }

    await connectToMongo();
    const { id } = verify.infos;
    user = await UserModel.findById(id);

    if (isEmpty(user)) {
      res = new NextResponse(
        JSON.stringify({ error: "User not found" }, { status: 404 })
      );
      res.cookies.set(cookieName, "", { maxAge: -1 });
      return res;
    }

    const existToken = user.tokens.find(
      (t) => t.obj === authTokenName && t.value === token
    );

    if (isEmpty(existToken)) {
      res = new NextResponse(
        JSON.stringify({ error: "Invalid token" }, { status: 403 })
      );
      res.cookies.set(cookieName, "", { maxAge: -1 });
      return res;
    }

    user = await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: { tokens: existToken },
      },
      { new: true }
    );

    res = new NextResponse(
      JSON.stringify({ loggedOut: true }, { status: 200 })
    );

    res.cookies.set(cookieName, "", { maxAge: -1 });
    return res;
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
