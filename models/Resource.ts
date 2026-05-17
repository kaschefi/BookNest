import mongoose, { Schema, model, models } from "mongoose";

interface IResource {
    title: string;
    lesson: mongoose.Types.ObjectId;
    type: "midterm" | "final" | "pamphlet";
    fileUrl: string;
    mimeType?: string;
    size?: number;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const ResourceSchema = new Schema<IResource>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },

        type: {
            type: String,
            enum: ["midterm", "final", "pamphlet"],
            required: true
        },

        fileUrl: {
            type: String,
            required: true
        },

        mimeType: {
            type: String
        },

        size: {
            type: Number
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);


ResourceSchema.index({ lesson: 1, type: 1 });
ResourceSchema.index({ uploadedBy: 1 });

const Resource =
    models.Resource || model<IResource>("Resource", ResourceSchema);

export default Resource;