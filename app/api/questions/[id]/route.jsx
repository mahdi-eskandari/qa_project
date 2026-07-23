import connectdb from '@/app/db/connection';
import { User } from '@/app/model/user';
import { NextResponse } from 'next/server';
import Question from './../../../model/question';
import Answer from './../../../model/answer';


export async function DELETE(req, {params}) {
try {
    await connectdb()
    const deleteQuestion = await Question.findByIdAndDelete(params.id)
    if(!deleteQuestion) {
        return NextResponse.json(
            {message: "Question not found"},
            {status: 404}
        )
    }

        return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );



} catch (error) {
    console.log(error)
 return NextResponse.json(
      { message: "Error deleting question" },
      { status: 500 }
    );
}
}





export async function GET(req, {params}) {
    try {
await connectdb()

const question = await Question.findById(params.id).populate("author", "username image")
  .populate({
    path: "answers",
    populate: {
      path: "author",
      select: "username image",
    },
  });


if(!question) {
        return NextResponse.json(
            {message: "Question not found"},
            {status: 404}
        )
    }

            return NextResponse.json(question, { status: 200 }
            )

    } catch(error) {
    console.log(error)
 return NextResponse.json(
      { message: "Error getting question" },
      { status: 500 }
    );
    }
}