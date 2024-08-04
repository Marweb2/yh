import {
  activateUserCompteTokenName,
  authTokenName,
  cookieName,
  maxAgeAuthToken,
  resetPasswordTokenName,
} from "@/lib/constants";
import { createToken, verifyToken } from "@/lib/jwt";
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/db";

export const GET = async (req, { params }) => {
  try {
    let verify;
    let user;
    let res;
    let infos;
    const { token } = params;
    await connectToMongo();

    if (isEmpty(token)) {
      return new NextResponse(
        JSON.stringify({ error: "No token" }, { status: 200 })
      );
    }

    verify = verifyToken(token);
    // error expired token
    if (verify?.name === "TokenExpiredError") {
      return new NextResponse(
        JSON.stringify({ expiredTokenError: true }, { status: 200 })
      );
    }
    // error invalid token
    else if (isEmpty(verify?.infos)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token" }, { status: 200 })
      );
    }

    // token to reset password
    else if (verify.infos?.resetPassword) {
      user = await UserModel.findById(verify.infos?.id);

      const existToken = user?.tokens.find(
        (t) => t.obj === resetPasswordTokenName && t.value === token
      );

      // error token not valid anymore
      if (isEmpty(existToken)) {
        return new NextResponse(
          JSON.stringify({ notAnymoreValidToken: true }, { status: 200 })
        );
      }

      return new NextResponse(
        JSON.stringify(
          { secure: true, token: existToken, id: verify.infos.id },
          { status: 200 }
        )
      );
    } else if (verify.infos?.activateUserCompte) {
      user = await UserModel.findById(verify.infos?.id);

      // error token not valid anymore
      if (isEmpty(user) || user?.isActive) {
        return new NextResponse(
          JSON.stringify({ error: true }, { status: 403 })
        );
      }

      const existToken = user.tokens.find(
        (t) => t.obj === activateUserCompteTokenName && t.value === token
      );

      // error token not valid anymore
      if (isEmpty(existToken)) {
        return new NextResponse(
          JSON.stringify({ notAnymoreValidToken: true }, { status: 200 })
        );
      }

      await UserModel.findByIdAndUpdate(
        user._id,
        {
          $pull: { tokens: existToken },
          $set: { isActive: true },
        },
        { new: true }
      );

      infos = {
        id: user._id,
        userType: user.userType,
        isAdmin: user.isAdmin,
        lang: user.lang,
      };
      const authToken = createToken(infos, maxAgeAuthToken);

      // add new auth token
      const newToken = { obj: authTokenName, value: authToken };

      await UserModel.findByIdAndUpdate(
        user._id,
        {
          $push: { tokens: newToken },
        },
        { new: true }
      );

      // login
      const { password, tokens, isAdmin, image, ...userInfos } = Object.assign(
        {},
        user.toJSON()
      );

      res = new NextResponse(
        JSON.stringify(
          {
            active: true,
            user: {
              ...userInfos,
              image: user?.image && user.image[0] ? [user.image[0]] : [],
            },
            token: authToken,
            userType: user.userType,
            lang: user.lang,
            verify,
          },
          { status: 200 }
        )
      );

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };

      // adding cookies
      res.cookies.set(cookieName, authToken, options);

      return res;
    } else {
      return new NextResponse(JSON.stringify(verify, { status: 200 }));
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }, { status: 500 })
    );
  }
};
