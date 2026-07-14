import connectDB from "../lib/mongoose";
import User from "../models/User";

export interface UserQuery {
    search?: string;
    role?: "guest" | "user" | "admin" | "all";
    page?: number;
    limit?: number;
}

const DEFAULT_LIMIT = 20;

export async function getAllUsers() {
    await connectDB();
    return User.find().select("-password").sort({ name: 1 });
}

export async function getUsers(query: UserQuery = {}) {
    await connectDB();

    const {
        search,
        role = "all",
        page = 1,
        limit = DEFAULT_LIMIT,
    } = query;

    const filter: Record<string, unknown> = {};

    if (role !== "all") {
        filter.role = role;
    }

    if (search) {
        const pattern = new RegExp(search, "i");
        filter.$or = [
            { name: pattern },
            { last_name: pattern },
            { email: pattern },
            { student_id: pattern },
        ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-password")
            .sort({ name: 1, email: 1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getUserById(id: string) {
    await connectDB();
    return User.findById(id).select("-password");
}

export async function getUserByEmail(email: string) {
    await connectDB();
    // Keep password here — used internally for auth comparisons
    return User.findOne({ email });
}

export async function updateUser(
    id: string,
    data: { name?: string; last_name?: string; student_id?: string; field_id?: string; role?: string; status?: "Active" | "Banned" }
) {
    await connectDB();
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password");
}

export async function deleteUser(id: string) {
    await connectDB();
    return User.findByIdAndDelete(id);
}
