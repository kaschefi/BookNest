import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

export default mongoose.models.Field || mongoose.model("Field", FieldSchema);