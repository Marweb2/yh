/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import ProjetModel from "@/lib/models/projet.model";

export const PATCH = async (req, { params }) => {
  const { projet } = params;

  try {
    await connectToMongo();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const assistant = searchParams.get("assistant");

    if (status === "accept" && assistant) {
      const data = await ProjetModel.findOneAndUpdate(
        { _id: projet },
        {
          $pull: { assistantsRejected: { id: assistant } },
          $push: { assistantsAccepted: { id: assistant } },
        },
        { new: true }
      );
      return new NextResponse(
        JSON.stringify({ projet: data }, { status: 200 })
      );
    } else if (status === "decline" && assistant) {
      const data = await ProjetModel.findOneAndUpdate(
        { _id: projet },
        {
          $pull: { assistantsAccepted: { id: assistant } },
          $push: { assistantsRejected: { id: assistant } },
        },
        { new: true }
      );
      return new NextResponse(
        JSON.stringify({ projet: data }, { status: 200 })
      );
    }
    return new NextResponse(
      JSON.stringify({ success: false }, { status: 400 })
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
