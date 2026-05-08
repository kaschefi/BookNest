import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: false },

    student_id: { type: String, required: false, unique: true, sparse: true },

    field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
        required: false
    },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: false },

    role: {
        type: String,
        enum: ["guest", "user", "admin"],
        default: "guest"
    }
});

// Delete cached model to ensure schema updates apply during hot-reload
if (mongoose.models.User) {
    delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);