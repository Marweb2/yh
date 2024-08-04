/** @format */

// /** @format */

// import { NextResponse } from "next/server";
// import connectToMongo from "@/lib/db";
// import ProjetModel from "@/lib/models/projet.model";

// const isNumber = (chaine) => {
//   const nombre = Number(chaine);
//   return !isNaN(nombre) && isFinite(nombre);
// };
// //assistants
// export const GET = async (req, { params }) => {
//   await connectToMongo();

//   const { projectId } = params;
//   const data = await ProjetModel.findById(projectId);
//   return new NextResponse(JSON.stringify({ data }, { status: 200 }));
// };
