import connectdb from "../../../db/connection"
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import User from "../../../model/user"
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectdb();

        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        // لاگ برای دیباگ در ترمینال VSCode
        console.log("Token received in /api/auth/me:", token);

        // اگر توکن اصلاً وجود نداشت
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // بررسی و تایید توکن (اگر منقضی شده باشد اینجا خطا می‌دهد و وارد catch می‌شود)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        return NextResponse.json({ user });

    } catch (error) {

        console.error("Verification error details:", error.message);

        // کوکی خراب یا منقضی شده را از مرورگر پاک می‌کنیم
        const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        response.cookies.set("token", "", { maxAge: 0, path: "/" });
        return response;
    }
}
