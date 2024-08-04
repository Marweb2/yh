/** @format */

import connectToMongo from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import ProjetModel from "@/lib/models/projet.model";

export const GET = async (req, { params }) => {
  const { assistant } = params;
  const pageNumber = req.nextUrl.searchParams.get("page");

  try {
    await connectToMongo();

    const user = await UserModel.findOne({
      _id: assistant,
    }).select("assistantProjets");

    const projetIds = user.assistantProjets.map((value) => {
      return value.projectId;
    });

    const projet = await ProjetModel.find({
      _id: { $in: projetIds },
      status: "Visible",
    }).populate("clientId", "name username image disponibilite");

    const data = projet.map((value, i) => {
      const a = user.assistantProjets.find(
        (val) => val.projectId === value._id.toString()
      );
      return {
        project: value,
        correspondance: a.correspondance,
      };
    });

    let returnValue = [];

    const firstIndex = parseInt(pageNumber) * 4 - 4;
    const lastIndex = firstIndex + 4;

    const lastIndexIfArraygreaterthan4 = (data?.length - 1) % 4;

    if (data?.length > 4) {
      returnValue = data.slice(firstIndex, lastIndex);
    } else {
      returnValue = data;
    }

    return new NextResponse(
      JSON.stringify(
        {
          data: returnValue,
          pageNumber: Math.ceil(data?.length / 4),
          lastIndex: lastIndexIfArraygreaterthan4,
        },
        { status: 200 }
      )
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err.message }, { status: 500 })
    );
  }
};
