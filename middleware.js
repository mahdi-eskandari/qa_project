// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(request) {
//   const token = request.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.redirect(new URL("/login", request.url));
//     console.log(error)
//   }
// }

// export const config = {
//   matcher: ["/", "/questions/:path*", "/dashboard/:path*", "/profile/:path*"],
// };

import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/questions/:path*", "/dashboard/:path*", "/profile/:path*"],
};
