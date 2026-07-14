import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    department: { type: String, required: false, trim: true },

    student_id: { type: String, required: false, unique: true, sparse: true },

    field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
        required: false,
    },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },

    // "local" | "github" | "google" | "apple"
    provider: { type: String, default: "local" },

    role: {
        type: String,
        enum: ["guest", "user", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["Active", "Banned"],
        default: "Active",
    },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);