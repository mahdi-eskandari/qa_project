import { model, models, Schema } from "mongoose";
import User from "./user";

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, // این هم برای وصل شدن به مدل دیگر نیاز است
        ref: "User", // نام مدلی که بهش وصل میشه
        required: true
    },
    answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
}, { timestamps: true })


const Question = models.Question || model('Question', questionSchema);
export default Question;

