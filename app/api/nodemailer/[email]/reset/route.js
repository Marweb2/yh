import { nodeMailer } from "@/components/nodemailer";
import { resetPassword } from "@/components/nodemailer/resetPassword";
import {
  maxAgeOneHour,
  maxAgeOneDay,
  resetPasswordTokenName,
} from "@/lib/constants";
import { emailController } from "@/lib/controllers/email.controller";
import connectToMongo from "@/lib/db";
import { createToken } from "@/lib/jwt";
import UserModel from "@/lib/models/user.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { NextResponse } from "next/server";
export const GET = async (req, { params }) => {
  try {
    let token;
    let user;
    let infos;
    let res;
    const { email } = params;

    // error invalid email
    if (!emailController(email)) {
      infos = { email, invalidEmailError: true };
      token = createToken(infos, maxAgeOneHour);
      return new NextResponse(JSON.stringify({ token }, { status: 400 }));
    }

    await connectToMongo();
    user = await UserModel.findOne({ email }).select(
      "-image -password -tokens"
    );

    //  error user not found
    if (isEmpty(user)) {
      infos = { email, userNotFound: true };
      token = createToken(infos, maxAgeOneHour);
      return new NextResponse(JSON.stringify({ token }, { status: 404 }));
    }

    // error not active
    if (!user.isActive) {
      infos = {
        email,
        login: true,
        notActive: true,
      };
      token = createToken(infos, maxAgeOneHour);
      return new NextResponse(
        JSON.stringify({ error: token, notActive: true }, { status: 403 }) // Changed status to 403 for invalid password
      );
    }

    infos = {
      resetPassword: true,
      email,
      id: user._id,
    };
    token = createToken(infos, maxAgeOneDay);

    // sending reset password email
    res = await nodeMailer({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      ...resetPassword({
        email,
        userType: user.userType,
        lang: user.lang,
        token,
      }),
    });

    // error while sending email
    if (!isEmpty(res?.error)) {
      infos = { email, error: res.error, sendEmailError: true };
      token = createToken(infos, maxAgeOneHour);
      return new NextResponse(JSON.stringify({ token }, { status: 400 }));
    }

    const newResetToken = { obj: resetPasswordTokenName, value: token };

    const isExistResetPassword = user.tokens?.find(
      (token) => token.obj === resetPasswordTokenName
    );

    if (!isEmpty(isExistResetPassword)) {
      user = await UserModel.findByIdAndUpdate(
        user._id,
        {
          $pull: { tokens: { obj: resetPasswordTokenName } },
        },
        { new: true }
      );
    }

    user = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $push: { tokens: newResetToken },
      },
      { new: true }
    );

    infos = {
      emailSent: true,
      email,
      id: user._id,
    };

    token = createToken(infos, maxAgeOneHour);

    return new NextResponse(JSON.stringify({ token }, { status: 200 }));
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }, { status: 500 })
    );
  }
};
