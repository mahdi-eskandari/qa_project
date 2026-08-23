import bcrypt from "bcrypt";
import crypto from "crypto";
import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("REGISTER ROUTE HIT");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("BASE URL:", baseUrl);

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL is not defined" },
        { status: 500 }
      );
    }

    await connectdb();
    console.log("DB CONNECTED");

    const { username, email, password } = await req.json();
    console.log("REQUEST BODY:", { username, email });

    const findUser = await User.findOne({ email });
    if (findUser) {
      console.log("USER EXISTS");
      return NextResponse.json(
        { error: "User exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      verified: false,
    });

    console.log("USER CREATED:", user._id);

    const verifyLink = `${baseUrl}/verify?token=${token}`;
    console.log("VERIFY LINK:", verifyLink);

    try {
      await sendEmail(email, verifyLink);
      console.log("EMAIL SENT SUCCESSFULLY");

      return NextResponse.json(
        { message: "User created. Check your email." },
        { status: 201 }
      );
    } catch (emailError) {
      console.error("EMAIL FAILED:", emailError);

      return NextResponse.json(
        {
          message:
            "User created, but verification email failed. Please try resending it.",
          emailFailed: true,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      {
        error: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}
