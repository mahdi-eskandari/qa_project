import connectdb from "@/app/db/connection";
import User from "@/app/model/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

export async function POST(req) {
    try {
        await connectdb()

        const { email, password } = await req.json()
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            )
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { 
                    error: "Please verify your email",
                    needsVerification: true,
                    code: "EMAIL_NOT_VERIFIED",
                 },
                { status: 400 }
            )
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            )
        }


        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ساخت پاسخ
        const response = NextResponse.json({
            message: "Login successful",
            user: { username: user.username, email: user.email }
        }, { status: 200 });

        // تنظیم کوکی روی پاسخ
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // در لوکال فالس است
            sameSite: "lax", // به جای strict از lax استفاده کن تا در ریدایرکت‌ها راحت‌تر ارسال شود
            maxAge: 7 * 24 * 60 * 60,
            // maxAge: 60,
            path: "/"
        });

        return response; // حتماً آبجکتی که کوکی روی آن ست شده را return کن



    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}