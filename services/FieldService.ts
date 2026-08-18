import connectDB from "../lib/mongoose";
import Field from "../models/Field";
import { autoTranslateFieldName } from "../lib/translationService";

export async function getAllFields() {
    await connectDB();
    return Field.find().sort({ name: 1 });
}

export async function getFieldById(id: string) {
    await connectDB();
    return Field.findById(id);
}

export async function getFieldBySlug(slug: string) {
    await connectDB();
    return Field.findOne({ slug });
}

export async function createField(data: { name: string }) {
    await connectDB();

    // Auto-translate field name (English <-> Farsi)
    const { name: enName, faName } = await autoTranslateFieldName(data.name);

    return Field.create({
        name: enName,
        faName: faName
    });
}

export async function updateField(id: string, data: { name?: string }) {
    await connectDB();
    let updateData: Record<string, unknown> = { ...data };

    if (data.name) {
        const { name: enName, faName } = await autoTranslateFieldName(data.name);
        updateData.name = enName;
        updateData.faName = faName;
    }

    return Field.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

export async function deleteField(id: string) {
    await connectDB();
    return Field.findByIdAndDelete(id);
}