import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    type: {
        type: String,
        enum: ["midterm", "final", "pamphlet"]
    },
    file_path: String,
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    upload_date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.File || mongoose.model("File", FileSchema);