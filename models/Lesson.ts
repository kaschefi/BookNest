import mongoose, { Schema, model, models, HydratedDocument } from "mongoose";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

interface ILesson {
    field?: mongoose.Types.ObjectId;
    name: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const LessonSchema = new Schema<ILesson>(
    {
        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field",
            index: true
        },
        name: { type: String, required: true, trim: true },
        slug: { type: String, index: true }
    },
    { timestamps: true }
);

LessonSchema.pre("save", function () {
    const doc = this as HydratedDocument<ILesson>;

    if (!doc.slug || doc.isModified("name")) {
        doc.slug = slugify(doc.name);
    }
});

LessonSchema.index({ field: 1, name: 1 }, { unique: true, sparse: true });

const Lesson = models.Lesson || model<ILesson>("Lesson", LessonSchema);
export default Lesson;
