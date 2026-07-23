import mongoose from "mongoose";
import User from "../../model/user"
import Question from './../../model/question';
import connectdb from "../../db/connection";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function GET(req) {
    try {
            await connectdb();

        const questions = await Question.find().populate("author");
            return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return new Response("Failed to fetch questions", { status: 500 });
  }
}



export async function POST( req) {
    try {
await connectdb()

        const {title, description} = await req.json()
        if(!title || !description) {
            return NextResponse.json(
                 { error: "Title and description are required" },
                 { status: 400 }
            )
        }
        console.log(title,description)


const cookieStore = cookies()
const token = cookieStore.get("token")?.value

if(!token) {
    return NextResponse.json(
        { error: "You are not logged in" },
        { status: 401 }
    )
}

 const decoded = jwt.verify(token, process.env.JWT_SECRET) 
 if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

        const newQuestion = await Question.create({
            title,
            description,
            author: decoded.userId
        })

        return NextResponse.json(
      {
        message: "Question created successfully",
        question: newQuestion,
      },
      { status: 201 }
    );
    } catch (error) {
         console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
    }
}


// export async function DELETE(req) {
//   try{
// await connectdb()
// const {id} = await req.json()
// const question = await Question.findByIdAndDelete(id)
// return new Response(JSON.stringify(question), { status: 200 });
//   }catch {
//     console.error("❌ Error deleting question:", error);
//     return new Response("Failed to delete question", { status: 500 });
//   }
// }
