/** @format */

import { NextResponse } from "next/server";
import { cookieName } from "./lib/constants";
import { isEmpty } from "./lib/utils/isEmpty";
import { protecedPaths } from "./lib/utils/paths";

export function middleware(req) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/accueil", req.url));
  } else if (
    req.nextUrl.pathname === ("/login" || "/register" || "/fail" || "/success")
  ) {
    const token = req.cookies.get(cookieName);
    if (!isEmpty(token?.value)) {
      return NextResponse.redirect(new URL("/accueil", req.url));
    }
  } else if (
    req.nextUrl.pathname === "/accueil" ||
    protecedPaths.includes(req.nextUrl.pathname)
  ) {
    const token = req.cookies.get(cookieName);
    const hasToken = req.nextUrl.searchParams.has("t");
    if (isEmpty(token?.value) && !hasToken) {
      req.cookies.delete(cookieName);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}
