const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://bardia_db_user:A5GHWLLhqUWsabz9@cluster0.qr5skwz.mongodb.net/project';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    department: { type: String, required: false, trim: true },
    student_id: { type: String, required: false, unique: true, sparse: true },
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    provider: { type: String, default: "local" },
    role: { type: String, enum: ["guest", "user", "admin"], default: "user" },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
    await mongoose.connect(MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 10);
    
    const adminEmail = "realadmin@platform.com";
    
    let existing = await User.findOne({ email: adminEmail });
    if (existing) {
        existing.password = hashedPassword;
        existing.role = 'admin';
        await existing.save();
        console.log("Admin user updated");
    } else {
        await User.create({
            name: "Super",
            last_name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            student_id: "admin-" + Date.now(),
            provider: "local",
            role: "admin",
        });
        console.log("Admin user created");
    }
    
    process.exit(0);
}

main().catch(console.error);
