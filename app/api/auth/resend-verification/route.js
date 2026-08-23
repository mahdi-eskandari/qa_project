import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { NextResponse } from "next/server";
import { sendEmail } from "../../../utils/sendmail";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    await connectdb();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.verified === true) {
      return NextResponse.json(
        { error: "User is already verified" },
        { status: 400 }
      );
    }

    const token = randomBytes(32).toString("hex");

    user.verificationToken = token;
    user.verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const verifyLink = `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;

    await sendEmail(email, verifyLink);

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error full:", error);

    return NextResponse.json(
      {
        error: error?.message || "Server error",
        code: error?.code,
        command: error?.command,
      },
      { status: 500 }
    );
  }
}
