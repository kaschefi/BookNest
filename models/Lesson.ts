import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field"
    },
    name: String
});

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);