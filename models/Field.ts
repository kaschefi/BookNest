import { Schema, model, models, HydratedDocument } from "mongoose";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export interface IField {
    _id?: any;
    name: string;
    faName?: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const FieldSchema = new Schema<IField>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        faName: { type: String, required: false, trim: true },
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

if (models.Field) {
    delete (models as Record<string, unknown>).Field;
}

const Field = model<IField>("Field", FieldSchema);
export default Field;