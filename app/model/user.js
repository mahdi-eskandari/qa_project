import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "/user-icon.webp"
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false

    },
    verificationToken: String,
    verificationTokenExpires: Date
}, { timestamps: true })


const User = models.User || model("User", userSchema)
export default User