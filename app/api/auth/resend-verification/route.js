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
        { error: "This account is already verified" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is missing");
    }

    const token = randomBytes(32).toString("hex");

    const verifyLink =
      `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;

    /*
     * ابتدا ایمیل ارسال می‌شود.
     * اگر ارسال موفق بود، توکن در دیتابیس ذخیره می‌شود.
     */
    await sendEmail(email, verifyLink);

    user.verificationToken = token;
    user.verificationTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    return NextResponse.json(
      {
        message: "Verification email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", {
      message: error?.message,
      code: error?.code,
      statusCode: error?.statusCode,
    });

    return NextResponse.json(
      {
        error: error?.message || "Could not resend verification email",
      },
      { status: 500 }
    );
  }
}
