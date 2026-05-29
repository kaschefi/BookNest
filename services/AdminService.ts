import connectDB from "../lib/mongoose";
import Field from "../models/Field";
import Lesson from "../models/Lesson";
import Resource from "../models/Resource";
import User from "../models/User";

export async function getAdminStats() {
    await connectDB();

    const [
        totalResources,
        pendingResources,
        approvedResources,
        rejectedResources,
        totalUsers,
        adminUsers,
        totalFields,
        totalLessons,
        engagement,
    ] = await Promise.all([
        Resource.countDocuments(),
        Resource.countDocuments({ status: "pending" }),
        Resource.countDocuments({ status: "approved" }),
        Resource.countDocuments({ status: "rejected" }),
        User.countDocuments(),
        User.countDocuments({ role: "admin" }),
        Field.countDocuments(),
        Lesson.countDocuments(),
        Resource.aggregate([
            {
                $group: {
                    _id: null,
                    downloads: { $sum: "$downloads" },
                    views: { $sum: "$views" },
                    voteScore: { $sum: "$voteScore" },
                },
            },
        ]),
    ]);

    const totals = engagement[0] ?? { downloads: 0, views: 0, voteScore: 0 };

    return {
        resources: {
            total: totalResources,
            pending: pendingResources,
            approved: approvedResources,
            rejected: rejectedResources,
        },
        users: {
            total: totalUsers,
            admins: adminUsers,
        },
        catalog: {
            fields: totalFields,
            lessons: totalLessons,
        },
        engagement: {
            downloads: totals.downloads,
            views: totals.views,
            voteScore: totals.voteScore,
        },
    };
}
