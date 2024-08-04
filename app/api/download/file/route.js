/** @format */
import connectToMongo from "@/lib/db";
import MessageModel from "@/lib/models/message-model-final";
import { NextResponse } from "next/server";
import PublicationModel from "@/lib/models/publication-model";

// pages/api/download.js

const createErrorResponse = (message, status = 500) => {
  return new NextResponse(JSON.stringify({ error: message }), { status });
};

export async function GET(req) {
  try {
    await connectToMongo();
    const pubId = req.nextUrl.searchParams.get("publication");
    const data = await PublicationModel.findById(pubId);
    const base64Image = data.attachment?.split(",")[1];
    const contentType = data.attachment
      ?.split(",")[0]
      ?.split(":")[1]
      ?.split(";")[0];
    const name = data.attachmentName.split(".");

    const binaryImageData = Buffer.from(base64Image, "base64");
    return new Response(binaryImageData, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=file-${
          data._id
        }-${new Date().getMilliseconds()}.${name[name.length - 1]}`,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
