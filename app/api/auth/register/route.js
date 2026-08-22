import bcrypt from "bcrypt";
import crypto from "crypto";
import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    await connectdb();

    const { username, email, password } = await req.json();

    const findUser = await User.findOne({ email });

    if (findUser) {
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
    });

    const verifiLink = `${baseUrl}/verify?token=${token}`;

    try {
      await sendEmail(email, verifiLink);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // اگر ایمیل ارسال نشد، کاربر ثبت‌شده را پاک می‌کنیم.
      await User.findByIdAndDelete(user._id);

      return NextResponse.json(
        {
          error:
            "ارسال ایمیل تأیید ناموفق بود. لطفاً دوباره تلاش کنید.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created. Check your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
