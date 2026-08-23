import bcrypt from "bcrypt";
import crypto from "crypto";
import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    console.log("ROUTE 1: REGISTER ROUTE HIT");

    await connectdb();

    const body = await req.json();

    console.log("ROUTE 2: BODY RECEIVED", {
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      verified: false,
    });

    await user.save();

    console.log("USER SAVED:", user._id);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const verifiLink = `${baseUrl}/verify?token=${verificationToken}`;

    console.log("ROUTE 3: BEFORE RESEND");

    try {
      await sendEmail(email, verifiLink);

      console.log("ROUTE 4: VERIFICATION EMAIL SENT");
    } catch (emailError) {
      console.error("RESEND ERROR:", emailError);

      return NextResponse.json(
        {
          error:
            "User was created, but verification email could not be sent",
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
