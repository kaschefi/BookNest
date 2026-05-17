import mongoose, { Schema, model, models, HydratedDocument } from "mongoose";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

interface IField {
    name: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const FieldSchema = new Schema<IField>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, unique: true, index: true }
    },
    { timestamps: true }
);

FieldSchema.pre("save", function () {
    const doc = this as HydratedDocument<IField>;

    if (!doc.slug || doc.isModified("name")) {
        doc.slug = slugify(doc.name);
    }
});

const Field = models.Field || model<IField>("Field", FieldSchema);
export default Field;