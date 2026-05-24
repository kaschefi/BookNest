import connectDB from "../lib/mongoose";
import Vote from "../models/Vote";
import { updateVoteScore } from "./ResourceService";

/**
 * Cast or change a vote. Returns the net score delta applied to the resource.
 *
 * Cases:
 *  - No prior vote → create, apply +1 or -1
 *  - Same vote again → remove (toggle off), reverse the delta
 *  - Opposite vote → update, apply ±2 (e.g. was -1, now +1 = delta of +2)
 */
export async function castVote(
    userId: string,
    resourceId: string,
    value: 1 | -1
): Promise<{ voteScore: number; userVote: 1 | -1 | 0 }> {
    await connectDB();

    const existing = await Vote.findOne({ user: userId, resource: resourceId });

    let delta = 0;
    let userVote: 1 | -1 | 0 = value;

    if (!existing) {
        // Fresh vote
        await Vote.create({ user: userId, resource: resourceId, value });
        delta = value;
    } else if (existing.value === value) {
        // Toggle off — remove the vote
        await Vote.deleteOne({ _id: existing._id });
        delta = -value;
        userVote = 0;
    } else {
        // Flip the vote
        await Vote.updateOne({ _id: existing._id }, { value });
        delta = value * 2;
    }

    const updated = await updateVoteScore(resourceId, delta);
    return { voteScore: updated?.voteScore ?? 0, userVote };
}

/**
 * Get the current user's vote on a resource (1, -1, or 0 for no vote).
 */
export async function getUserVote(userId: string, resourceId: string): Promise<1 | -1 | 0> {
    await connectDB();
    const vote = await Vote.findOne({ user: userId, resource: resourceId });
    return (vote?.value as 1 | -1) ?? 0;
}