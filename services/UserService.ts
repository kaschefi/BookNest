import connectDB from "../lib/mongoose";
import User from "../models/User";

export async function getAllUsers() {
    await connectDB();
    return User.find().select("-password").sort({ name: 1 });
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
    data: { name?: string; last_name?: string; student_id?: string; field_id?: string; role?: string }
) {
    await connectDB();
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password");
}

export async function deleteUser(id: string) {
    await connectDB();
    return User.findByIdAndDelete(id);
}