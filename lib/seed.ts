import Field from "../models/Field";
import Lesson from "../models/Lesson";

export async function seedDBIfEmpty() {
    const fieldCount = await Field.countDocuments();
    if (fieldCount > 0) {
        return;
    }

    console.log("[Seeding] Database is empty. Starting automated seeding...");

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

    console.log("[Seeding] Automated seeding completed successfully.");
}
