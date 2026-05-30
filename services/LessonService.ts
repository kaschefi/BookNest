import connectDB from "../lib/mongoose";
import Lesson from "../models/Lesson";

type LessonAutocompleteItem = {
    _id: unknown;
    field?: unknown;
    field_id?: unknown;
    name: string;
    slug?: string;
};

function normalizeLesson(lesson: LessonAutocompleteItem) {
    const field = lesson.field ?? lesson.field_id;

    return {
        _id: lesson._id,
        field: field ? String(field) : "",
        name: lesson.name,
        slug: lesson.slug,
    };
}

export async function getAllLessons() {
    await connectDB();
    const lessons = await Lesson.find()
        .select("_id field field_id name slug")
        .sort({ name: 1 })
        .lean<LessonAutocompleteItem[]>();

    return lessons.map(normalizeLesson).filter((lesson) => lesson.field);
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
    const lessons = await Lesson.find()
        .select("_id field field_id name slug")
        .sort({ name: 1 })
        .lean<LessonAutocompleteItem[]>();

    return lessons
        .map(normalizeLesson)
        .filter((lesson) => lesson.field === fieldId);
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
