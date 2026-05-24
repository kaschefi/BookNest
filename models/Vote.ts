import mongoose, { Schema, model, models } from "mongoose";

interface IVote {
    user: mongoose.Types.ObjectId;
    resource: mongoose.Types.ObjectId;
    value: 1 | -1;   // upvote or downvote
    createdAt?: Date;
}

const VoteSchema = new Schema<IVote>(
    {
        user:     { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
        resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
        value:    { type: Number, enum: [1, -1], required: true },
    },
    { timestamps: true }
);

// One vote per user per resource
VoteSchema.index({ user: 1, resource: 1 }, { unique: true });

const Vote = models.Vote || model<IVote>("Vote", VoteSchema);
export default Vote;