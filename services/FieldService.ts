import connectDB from "../lib/mongoose";
import Field from "../models/Field";

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
    return Field.create(data);
}

export async function updateField(id: string, data: { name?: string }) {
    await connectDB();
    return Field.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteField(id: string) {
    await connectDB();
    return Field.findByIdAndDelete(id);
}