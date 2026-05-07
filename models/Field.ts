import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
    name: String
});

export default mongoose.models.Field || mongoose.model("Field", FieldSchema);