import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectdb();

    const body = await req.json();

    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser?.verified === true) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is missing");
    }

    const verifyLink =
      `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;

    let user = existingUser;

    if (user) {
      user.password = password;
      user.verificationToken = token;
      user.verificationTokenExpires = new Date(
        Date.now() + 15 * 60 * 1000
      );
    } else {
      user = new User({
        email,
        password,
        verified: false,
        verificationToken: token,
        verificationTokenExpires: new Date(
          Date.now() + 15 * 60 * 1000
        ),
      });
    }

    await sendEmail(email, verifyLink);
    await user.save();

    return NextResponse.json(
      {
        message: "Registration successful. Verification email sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", {
      message: error?.message,
      code: error?.code,
      statusCode: error?.statusCode,
    });

    return NextResponse.json(
      {
        error: error?.message || "Registration failed",
      },
      { status: 500 }
    );
  }
}
