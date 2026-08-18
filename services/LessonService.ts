import connectDB from "../lib/mongoose";
import Lesson from "../models/Lesson";
import { autoTranslateLessonName } from "../lib/translationService";

type LessonAutocompleteItem = {
    _id: unknown;
    field?: unknown;
    name: string;
    faName?: string;
    slug?: string;
};

function normalizeLesson(lesson: LessonAutocompleteItem) {
    return {
        _id: lesson._id,
        field: lesson.field ? String(lesson.field) : "",
        name: lesson.name,
        faName: lesson.faName || "",
        slug: lesson.slug,
    };
}

export async function getAllLessons() {
    await connectDB();
    const lessons = await Lesson.find()
        .select("_id field name faName slug")
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
        .select("_id field name faName slug")
        .sort({ name: 1 })
        .lean<LessonAutocompleteItem[]>();

    return lessons
        .map(normalizeLesson)
        .filter((lesson) => lesson.field === fieldId);
}

export async function createLesson(data: { field: string; name: string }) {
    await connectDB();
    
    // Auto-translate name (English <-> Farsi)
    const { name: enName, faName } = await autoTranslateLessonName(data.name);

    return Lesson.create({
        field: data.field,
        name: enName,
        faName: faName
    });
}

export async function updateLesson(id: string, data: { name?: string; field?: string }) {
    await connectDB();
    let updateData: Record<string, unknown> = { ...data };

    if (data.name) {
        const { name: enName, faName } = await autoTranslateLessonName(data.name);
        updateData.name = enName;
        updateData.faName = faName;
    }

    return Lesson.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

export async function deleteLesson(id: string) {
    await connectDB();
    return Lesson.findByIdAndDelete(id);
}
