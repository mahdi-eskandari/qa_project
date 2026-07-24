import connectdb from "../../../db/connection"
import Answer from './../../../model/answer';
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import Question from './../../../model/question';

export async function PUT(req, {params}) {
    try {
        await connectdb()
        const {id} = await params
        const {content} = await req.json()

        // ۱. بررسی توکن کاربر برای امنیت
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
         if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId
    
    // ۲. پیدا کردن پاسخ در دیتابیس
    const answer = await Answer.findById(id)
        if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }


    if (answer.author.toString() !== userId) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

   answer.content = content;
    await answer.save();

    return NextResponse.json({ message: "Answer updated successfully", answer });
    } catch (error) {
            console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





export async function DELETE(req, { params }) {
  try {
    await connectdb();

    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // نام درست فیلد مطابق payload توکن
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const answer = await Answer.findById(id);

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    const authorId = answer.author?._id
      ? String(answer.author._id)
      : String(answer.author);

    if (authorId !== String(userId)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

await Question.findByIdAndUpdate(answer.question, {
  $pull: { answers: answer._id },
});
await Answer.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Answer deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}