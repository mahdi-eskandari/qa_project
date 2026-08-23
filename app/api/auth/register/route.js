import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // اگر از bcrypt استفاده می‌کنی
import connectdb from "../../../db/connection";
import User from "../../../model/user";
import { sendEmail } from "../../../utils/sendmail";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectdb();

    const body = await req.json();
    const username = body?.username?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    // ۱. بررسی اعتبار ورودی‌ها
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // ۲. بررسی وجود کاربر قبلی
    const existingUser = await User.findOne({ email });

    if (existingUser?.verified === true) {
      return NextResponse.json(
        { error: "User already exists and is verified" },
        { status: 400 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is missing");
    }

    const verifyLink = `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;

    // هش کردن پسورد (اگر هوک pre-save در مدل نداری)
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = existingUser;

    if (user) {
      // آپدیت یوزری که قبلاً ثبت‌نام کرده اما وریفای نشده
      user.username = username;
      user.password = hashedPassword;
      user.verificationToken = token;
      user.verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    } else {
      // ساخت یوزر جدید همراه با username
      user = new User({
        username,
        email,
        password: hashedPassword,
        verified: false,
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    // ۳. ارسال ایمیل با Resend
    await sendEmail(email, verifyLink);

    // ۴. ذخیره در دیتابیس بعد از ارسال موفق ایمیل
    await user.save();

    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
