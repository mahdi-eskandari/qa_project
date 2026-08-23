import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectdb from "../../../db/connection";
import User from "../../../model/user";
// import sendVerificationEmail from "@/lib/sendVerificationEmail";

export async function POST(req) {
  try {
    await connectdb();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const demoMode = process.env.DEMO_MODE === "true";

    // =========================
    // DEMO MODE
    // =========================
    if (demoMode) {
      await User.create({
        username,
        email,
        password: hashedPassword,
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      });

      return NextResponse.json(
        {
          message:
            "Registration successful. This project is currently in demo mode, so your account has been verified automatically.",
          demoMode: true,
          emailSent: false,
        },
        { status: 201 }
      );
    }

    // =========================
    // REAL MODE (commented for later use)
    // =========================
    /*
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenExpires = new Date(Date.now() email,
      password * 60 * 60);

    await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const verificationLink = `${baseUrl}/api/auth/verify?token=${verificationToken}`;

    await sendVerificationEmail(email, verificationLink);

    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
        demoMode: false,
        emailSent: true,
      },
      { status: 201 }
    );
    */

    return NextResponse.json(
      {
        error:
          "Demo mode is disabled, but real verification flow is still commented out.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
