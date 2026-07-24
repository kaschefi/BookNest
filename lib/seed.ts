import bcrypt from "bcryptjs";
import User from "../models/User";
import Field from "../models/Field";
import Lesson from "../models/Lesson";
import Resource from "../models/Resource";

export async function seedDBIfEmpty() {
    // Seed default admin user if none exists
    const adminExists = await User.exists({ role: "admin" });
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminExists || !adminUser) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        adminUser = await User.create({
            name: "BookNest",
            last_name: "Admin",
            email: "admin@booknest.com",
            password: hashedPassword,
            role: "admin",
            provider: "local",
            status: "Active"
        });
        console.log("[Seeding] Seeded default admin account: admin@booknest.com / admin123");
    }

    const fieldCount = await Field.countDocuments();
    if (fieldCount === 0) {
        console.log("[Seeding] Fields empty. Starting automated seeding...");

        const initialData = {
            "Computer Science": [
                "Intro to Programming",
                "Data Structures and Algorithms",
                "Web Development",
                "Operating Systems",
                "Database Systems",
                "Artificial Intelligence"
            ],
            "Mathematics": [
                "Linear Algebra",
                "Calculus I",
                "Calculus II",
                "Discrete Mathematics",
                "Probability and Statistics",
                "Abstract Algebra"
            ],
            "Chemistry": [
                "General Chemistry",
                "Organic Chemistry",
                "Analytical Chemistry",
                "Biochemistry",
                "Physical Chemistry"
            ],
            "Physics": [
                "Classical Mechanics",
                "Electromagnetism",
                "Thermodynamics",
                "Quantum Mechanics",
                "Optics"
            ]
        };

        for (const [fieldName, lessons] of Object.entries(initialData)) {
            const field = await Field.create({ name: fieldName });
            for (const lessonName of lessons) {
                await Lesson.create({ field: field._id, name: lessonName });
            }
        }
    }

    // Seed initial notes if Resource collection is empty
    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0 && adminUser) {
        console.log("[Seeding] Notes empty. Seeding initial notes...");
        const lessons = await Lesson.find();
        if (lessons.length > 0) {
            const sampleNotes = [
                {
                    title: "Calculus I - Complete Midterm Exam Study Guide",
                    lessonName: "Calculus I",
                    type: "midterm",
                    semester: "fall",
                    year: 2025,
                    downloads: 42,
                    views: 156,
                    voteScore: 18,
                },
                {
                    title: "Linear Algebra - Matrix Transformations & Vector Spaces",
                    lessonName: "Linear Algebra",
                    type: "final",
                    semester: "spring",
                    year: 2025,
                    downloads: 29,
                    views: 98,
                    voteScore: 12,
                },
                {
                    title: "Data Structures - Trees, Graphs & Sorting Cheatsheet",
                    lessonName: "Data Structures and Algorithms",
                    type: "pamphlet",
                    semester: "fall",
                    year: 2025,
                    downloads: 64,
                    views: 210,
                    voteScore: 25,
                },
                {
                    title: "Intro to Programming - Python & Logic Basics",
                    lessonName: "Intro to Programming",
                    type: "midterm",
                    semester: "fall",
                    year: 2024,
                    downloads: 38,
                    views: 120,
                    voteScore: 15,
                },
                {
                    title: "Organic Chemistry - Reaction Mechanisms & Functional Groups",
                    lessonName: "Organic Chemistry",
                    type: "final",
                    semester: "spring",
                    year: 2025,
                    downloads: 51,
                    views: 180,
                    voteScore: 22,
                },
                {
                    title: "Classical Mechanics - Newton's Laws & Energy Conservation",
                    lessonName: "Classical Mechanics",
                    type: "midterm",
                    semester: "fall",
                    year: 2025,
                    downloads: 19,
                    views: 75,
                    voteScore: 8,
                }
            ];

            for (const sample of sampleNotes) {
                const matchedLesson = lessons.find(l => l.name.toLowerCase() === sample.lessonName.toLowerCase()) || lessons[0];
                await Resource.create({
                    title: sample.title,
                    lesson: matchedLesson._id,
                    type: sample.type,
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    publicId: `sample_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    mimeType: "application/pdf",
                    size: 245000,
                    uploadedBy: adminUser._id,
                    status: "approved",
                    semester: sample.semester,
                    year: sample.year,
                    downloads: sample.downloads,
                    views: sample.views,
                    voteScore: sample.voteScore,
                });
            }
            console.log("[Seeding] Successfully seeded initial notes!");
        }
    }

    console.log("[Seeding] Seeding completed.");
}
