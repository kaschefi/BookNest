import connectDB from "../lib/mongoose";
import Resource from "../models/Resource";
import Lesson from "../models/Lesson";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateResourceData {
    title: string;
    lesson: string;
    type: "midterm" | "final" | "pamphlet";
    fileUrl: string;
    publicId: string;
    mimeType?: string;
    size?: number;
    uploadedBy: string;
    semester: "fall" | "spring" | "summer";
    year: number;
}

export interface ResourceQuery {
    lessonId?: string;
    type?: "midterm" | "final" | "pamphlet";
    status?: "pending" | "approved" | "rejected";
    semester?: "fall" | "spring" | "summer";
    year?: number;
    search?: string;
    sortBy?: "newest" | "popular" | "votes";
    page?: number;
    limit?: number;
}

const DEFAULT_LIMIT = 20;

export interface AdminResourceQuery extends Omit<ResourceQuery, "status"> {
    status?: ResourceQuery["status"] | "all";
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getResources(query: ResourceQuery = {}) {
    await connectDB();

    const {
        lessonId, type, status,
        semester, year, search,
        sortBy = "newest",
        page = 1, limit = DEFAULT_LIMIT,
    } = query;

    const filter: Record<string, unknown> = {};

    if (status) {
        filter.status = status;
    } else {
        filter.status = { $ne: "rejected" };
    }

    if (lessonId)  filter.lesson   = lessonId;
    if (type)      filter.type     = type;
    if (semester)  filter.semester = semester;
    if (year)      filter.year     = year;

    // Case-insensitive partial substring search across title, lesson name, type, and semester
    if (search && search.trim()) {
        const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
        const matchingLessons = await Lesson.find({ name: regex }).select("_id");
        const lessonIds = matchingLessons.map((l) => l._id);

        filter.$or = [
            { title: regex },
            { type: regex },
            { semester: regex },
            ...(lessonIds.length > 0 ? [{ lesson: { $in: lessonIds } }] : []),
        ];
    }

    const sortMap = {
        newest:  { createdAt: -1 },
        popular: { downloads: -1 },
        votes:   { voteScore: -1 },
    } as const;

    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
        Resource.find(filter)
            .populate("lesson",     "name slug")
            .populate("uploadedBy", "name email avatarUrl")
            .sort(sortMap[sortBy])
            .skip(skip)
            .limit(limit),
        Resource.countDocuments(filter),
    ]);

    return {
        resources,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getAdminResources(query: AdminResourceQuery = {}) {
    await connectDB();

    const {
        lessonId, type, status = "all",
        semester, year, search,
        sortBy = "newest",
        page = 1, limit = DEFAULT_LIMIT,
    } = query;

    const filter: Record<string, unknown> = {};

    if (status !== "all") filter.status = status;
    if (lessonId) filter.lesson = lessonId;
    if (type) filter.type = type;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;

    if (search && search.trim()) {
        const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
        const matchingLessons = await Lesson.find({ name: regex }).select("_id");
        const lessonIds = matchingLessons.map((l) => l._id);

        filter.$or = [
            { title: regex },
            { type: regex },
            { semester: regex },
            ...(lessonIds.length > 0 ? [{ lesson: { $in: lessonIds } }] : []),
        ];
    }

    const sortMap = {
        newest: { createdAt: -1 },
        popular: { downloads: -1 },
        votes: { voteScore: -1 },
    } as const;

    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
        Resource.find(filter)
            .populate("lesson", "name slug field")
            .populate("uploadedBy", "name email avatarUrl role")
            .populate("reviewedBy", "name email")
            .sort(sortMap[sortBy])
            .skip(skip)
            .limit(limit),
        Resource.countDocuments(filter),
    ]);

    return {
        resources,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getResourceById(id: string) {
    await connectDB();
    return Resource.findById(id)
        .populate("lesson",     "name slug")
        .populate("uploadedBy", "name email avatarUrl")
        .populate("reviewedBy", "name email");
}

export async function createResource(data: CreateResourceData) {
    await connectDB();
    return Resource.create(data);
}

export async function updateResource(
    id: string,
    data: {
        title?: string;
        type?: "midterm" | "final" | "pamphlet";
        semester?: string;
        year?: number;
        status?: "pending" | "approved" | "rejected";
        reviewNote?: string;
        reviewedBy?: string;
    }
) {
    await connectDB();
    return Resource.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteResource(id: string) {
    await connectDB();
    return Resource.findByIdAndDelete(id);
}

// ─── Moderation ───────────────────────────────────────────────────────────────

export async function getPendingResources(page = 1, limit = DEFAULT_LIMIT) {
    await connectDB();
    const skip = (page - 1) * limit;
    const [resources, total] = await Promise.all([
        Resource.find({ status: "pending" })
            .populate("lesson",     "name slug")
            .populate("uploadedBy", "name email")
            .sort({ createdAt: 1 })   // oldest first — review in order
            .skip(skip)
            .limit(limit),
        Resource.countDocuments({ status: "pending" }),
    ]);
    return { resources, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function reviewResource(
    id: string,
    reviewedBy: string,
    status: "approved" | "rejected",
    reviewNote?: string
) {
    await connectDB();
    return Resource.findByIdAndUpdate(
        id,
        { status, reviewedBy, reviewNote },
        { new: true }
    );
}

// ─── Engagement ───────────────────────────────────────────────────────────────

export async function incrementDownloads(id: string) {
    await connectDB();
    return Resource.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true });
}

export async function incrementViews(id: string) {
    await connectDB();
    return Resource.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
}

export async function updateVoteScore(id: string, delta: number) {
    await connectDB();
    return Resource.findByIdAndUpdate(id, { $inc: { voteScore: delta } }, { new: true });
}
