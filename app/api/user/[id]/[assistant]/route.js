/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import favoriteModel from "@/lib/models/favorites.model";
import { isEmpty } from "@/lib/utils/isEmpty";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params, query }) => {
  await connectToMongo();
  try {
    const data = await favoriteModel.updateOne(
      { client: params.id },
      { $push: { assistant: params.assistant } }
    );

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const DELETE = async (req, { params, query }) => {
  await connectToMongo();
  try {
    const data = await favoriteModel.updateOne(
      { client: params.id },
      { $pull: { assistant: params.assistant } }
    );

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PUT = async (req, { params, query }) => {
  await connectToMongo();
  try {
    const data = await favoriteModel
      .findOne({ client: params.id })
      .populate("assistant");

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const GET = async (req, { params, query }) => {
  await connectToMongo();
  try {
    const data = await favoriteModel.findOne({ client: params.id });

    return new NextResponse(JSON.stringify({ data: data.assistant }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
