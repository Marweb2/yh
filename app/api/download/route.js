/** @format */
import connectToMongo from "@/lib/db";
import MessageModel from "@/lib/models/message-model-final";
import { NextResponse } from "next/server";

// pages/api/download.js

const createErrorResponse = (message, status = 500) => {
  return new NextResponse(JSON.stringify({ error: message }), { status });
};

export async function GET(req) {
  const messageId = req.nextUrl.searchParams.get("message");
  await connectToMongo();
  const data = await MessageModel.findById(messageId);
  const base64Image = data.document?.split(",")[1];
  const contentType = data.document
    ?.split(",")[0]
    ?.split(":")[1]
    ?.split(";")[0];

  const binaryImageData = Buffer.from(base64Image, "base64");
  return new Response(binaryImageData, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename=${data.content}`,
      "Content-Type": contentType,
    },
  });
}
