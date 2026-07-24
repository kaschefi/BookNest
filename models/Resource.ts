import mongoose, { Schema, model, models } from "mongoose";

interface IResource {
    title: string;
    lesson: mongoose.Types.ObjectId;
    type: "midterm" | "final" | "pamphlet";
    fileUrl: string;
    publicId: string;         // Cloudinary public_id for deletion
    mimeType?: string;
    size?: number;
    uploadedBy: mongoose.Types.ObjectId;
    // Moderation
    status: "pending" | "approved" | "rejected";
    reviewedBy?: mongoose.Types.ObjectId;
    reviewNote?: string;
    // Academic context
    semester: "fall" | "spring" | "summer";
    year: number;
    // Engagement
    downloads: number;
    views: number;
    // Votes are stored in Vote collection; voteScore is a denormalized cache
    voteScore: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ResourceSchema = new Schema<IResource>(
    {
        title: { type: String, required: true, trim: true },
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
        type: { type: String, enum: ["midterm", "final", "pamphlet"], required: true },
        fileUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        mimeType: { type: String },
        size: { type: Number },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewNote: { type: String },
        semester: { type: String, enum: ["fall", "spring", "summer"], required: true },
        year: { type: Number, required: true },
        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        voteScore: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Full-text search index
ResourceSchema.index({ title: "text" });
// Common query patterns
ResourceSchema.index({ lesson: 1, status: 1 });
ResourceSchema.index({ status: 1, createdAt: -1 });
ResourceSchema.index({ uploadedBy: 1 });
ResourceSchema.index({ year: -1, semester: 1 });

const Resource = models.Resource || model<IResource>("Resource", ResourceSchema);
export default Resource;