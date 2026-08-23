import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";

export const runtime = "nodejs";

export async function POST(req) {
  console.log("REGISTER ROUTE HIT");

  try {
    await connectdb();

    const body = await req.json();

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

    if (existingUser?.verified === true) {
      return NextResponse.json(
        {
          error: "User already exists and is verified",
        },
        { status: 400 }
      );
    }

    const token = randomBytes(32).toString("hex");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is missing");
    }

    const verifyLink = `${baseUrl.replace(
      /\/$/,
      ""
    )}/verify?token=${token}`;

    // اگر User Schema هوک pre-save برای هش کردن پسورد ندارد،
    // باید همین‌جا پسورد را هش کنیم.
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = existingUser;

    if (user) {
      user.username = username;
      user.password = hashedPassword;
      user.verified = false;
      user.verificationToken = token;
      user.verificationTokenExpires = new Date(
        Date.now() + 15 * 60 * 1000
      );
    } else {
      user = new User({
        username,
        email,
        password: hashedPassword,
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
        message:
          "Registration successful. Verification email sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", {
      message: error?.message,
      code: error?.code,
      statusCode: error?.statusCode,
      stack: error?.stack,
    });

    return NextResponse.json(
      {
        error: error?.message || "Registration failed",
      },
      { status: 500 }
    );
  }
}
