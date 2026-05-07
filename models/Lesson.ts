import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
        required: true
    },

    name: { type: String, required: true }
});

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);