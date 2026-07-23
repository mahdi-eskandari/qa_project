import { NextResponse } from "next/server";
import connectdb from "../../../db/connection";
import User from "../../../model/user"

export async function POST(req) {
    try {

        await connectdb()

        const { token } = await req.json()
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 })
        }

        user.isVerified = true
        user.verificationToken = null
        user.verificationTokenExpires = null

        await user.save()

        return NextResponse.json({ message: "Email verified" })
        console.log(user)

    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}
