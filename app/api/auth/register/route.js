import bcrypt from "bcrypt"
import crypto from "crypto"
import connectdb from "../../../db/connection"
import User from "../../../model/user"
import { sendEmail } from "../../../utils/sendmail"
import { NextResponse } from "next/server"


export async function POST(req) {
    try {
        await connectdb()

        const { username, email, password } = await req.json()
        const findUser = await User.findOne({ email })

        if (findUser) {
            return NextResponse.json({ error: "User exsits" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const token = crypto.randomBytes(32).toString("hex")

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationToken: token,
            // verificationTokenExpires: Date.now() + 1000 * 60 * 60
            verificationTokenExpires: new Date(Date.now() + 15 * 1000)
        })

        const verifiLink = `http://localhost:3000/verify?token=${token}`

        await sendEmail(email, verifiLink)

        return NextResponse.json({
            message: "User created. Check your email."
        })

    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }

}