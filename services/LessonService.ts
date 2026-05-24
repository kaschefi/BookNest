import connectDB from "../lib/mongoose";
import Lesson from "../models/Lesson";

export async function getAllLessons() {
    await connectDB();
    return Lesson.find().populate("field", "name slug").sort({ name: 1 });
}

export async function getLessonById(id: string) {
    await connectDB();
    return Lesson.findById(id).populate("field", "name slug");
}

export async function getLessonBySlug(slug: string) {
    await connectDB();
    return Lesson.findOne({ slug }).populate("field", "name slug");
}

export async function getLessonsByField(fieldId: string) {
    await connectDB();
    return Lesson.find({ field: fieldId }).sort({ name: 1 });
}

export async function createLesson(data: { field: string; name: string }) {
    await connectDB();
    return Lesson.create(data);
}

export async function updateLesson(id: string, data: { name?: string; field?: string }) {
    await connectDB();
    return Lesson.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteLesson(id: string) {
    await connectDB();
    return Lesson.findByIdAndDelete(id);
}