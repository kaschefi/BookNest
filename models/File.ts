import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },

    type: {
        type: String,
        enum: ["midterm", "final", "pamphlet"],
        required: true
    },

    file_path: { type: String, required: true },

    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    upload_date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.File || mongoose.model("File", FileSchema);