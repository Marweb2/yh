import connectToMongo from "@/lib/db";
import { isValidObjectId } from "mongoose";
// import UserModel from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import { isEmpty } from "@/lib/utils/isEmpty";

export function calculerNombrePages(total_elements, elements_par_page) {
  let nombre_pages = total_elements / elements_par_page;

  if (total_elements % elements_par_page !== 0) {
    nombre_pages = Math.ceil(nombre_pages);
  }

  return nombre_pages;
}

export const isNumber = (chaine) => {
  return !isNaN(parseFloat(chaine)) && isFinite(chaine);
};

export const getClientId = (req) => req.nextUrl.searchParams.get("client");
export const getAssistantId = (req) =>
  req.nextUrl.searchParams.get("assistant");
export const getAvisId = (req) => req.nextUrl.searchParams.get("avis");

export const getProjectId = (params) => params.projectId;

export function determineTooltip(status) {
  if (status === "infos") {
    return {
      left: "Messagerie",
      lAbr: "mes",
      right: "Questions",
      rAbr: "qs",
    };
  } else if (status === "qs") {
    return {
      left: "Inforpojet",
      lAbr: "infos",
      right: "Messagerie",
      rAbr: "mes",
    };
  } else if (status === "mes") {
    return {
      left: "Questions",
      lAbr: "qs",
      right: "infoprojet",
      rAbr: "infos",
    };
  }
}

export const validateUserId = async (userId, UserModel) => {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid ID");
  }

  await connectToMongo();
  const user = await UserModel.findById(userId);

  if (isEmpty(user)) {
    throw new Error("User not found");
  }

  if (user.userType !== "client" && user.userType !== "assistant") {
    throw new Error("Invalid user type");
  }

  return user;
};

export const createErrorResponse = (message, status = 500) => {
  return new NextResponse(JSON.stringify({ error: message }), { status });
};

export const createJsonResponse = (data, status = 200) => {
  return new NextResponse(JSON.stringify(data), { status });
};

export const extractUnfollowedIds = (data) => {
  if (data) {
    return data.map((a) => a.unfollowedUser);
  }
  return null;
};
export const extractPublicationIds = (data) => {
  if (data) {
    return data.map((a) => a.publication);
  }
  return null;
};
