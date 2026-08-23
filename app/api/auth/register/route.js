import bcrypt from "bcrypt";
import crypto from "crypto";
import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export async function POST(req) {
  try {
    console.log("REGISTER ROUTE HIT");

    await connectdb();

    const body = await req.json();
    console.log("REGISTER BODY:", {
      username: body?.username,
      email: body?.email,
      hasPassword: Boolean(body?.password),
    });

    const username = body?.username?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          error: "Username, email, and password are required",
        },
        { status: 400 }
      );
    }

    // بررسی کاربر، hash کردن پسورد و ساخت token

    await user.save();

    console.log("USER SAVED");

    try {
      await sendEmail(email, verifiLink);
      console.log("VERIFICATION EMAIL SENT");
    } catch (emailError) {
      console.error("RESEND ERROR:", emailError);

      return NextResponse.json(
        {
          error: "User was created, but verification email could not be sent",
          details: emailError?.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User created. Check your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

