import connectdb from "../../db/connection";
import  jwt from 'jsonwebtoken';
import User from './../../model/user';
import Question from './../../model/question';
import Answer from './../../model/answer';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await connectdb();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: token not found" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { content, questionId } = await req.json();

    if (!content || !questionId) {
      return NextResponse.json(
        { message: "content and questionId are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    const newAnswer = await Answer.create({
      content,
      author: user._id,
      question: question._id,
    });

    await Question.findByIdAndUpdate(question._id, {
      $addToSet: { answers: newAnswer._id },
    });

    return NextResponse.json(
      {
        message: "Answer created successfully",
        answer: newAnswer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/answers error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
