import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    last_name: String,
    student_id: String,
    field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field"
    },
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["guest", "user", "admin"],
        default: "guest"
    }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);