/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import ResponseModel from "@/lib/models/responseModel";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { projetId } = params;
    const searchParams = req.nextUrl.searchParams;
    const assistantId = searchParams.get("assistant");
    await connectToMongo();

    const data = await ResponseModel.findOne({
      assistantId,
      projetId,
    });

    if (!data)
      return new NextResponse(
        JSON.stringify({ found: false }, { status: 404 })
      );

    return new NextResponse(
      JSON.stringify({ data, found: true }, { status: 200 })
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};

export const POST = async (req, { params }) => {
  const { projetId } = params;
  const searchParams = req.nextUrl.searchParams;
  const assistantId = searchParams.get("assistant");
  try {
    await connectToMongo();
    const { responses } = await req.json();
    const data = await ResponseModel.create({
      assistantId,
      projetId,
      response: responses,
    });
    return new NextResponse(JSON.stringify({ created: true }, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
