"use client";

import { useState, useEffect, useMemo } from "react";

interface IField {
    _id: string;
    name: string;
    slug: string;
}

interface ILesson {
    _id: string;
    name: string;
    slug: string;
    field?: string | { _id?: string; name?: string; slug?: string };
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
const SEMESTERS = ["fall", "spring", "summer"] as const;

function getLessonFieldId(lesson: ILesson) {
    if (!lesson.field) {
        return "";
    }

    return typeof lesson.field === "string" ? lesson.field : lesson.field._id ?? "";
}

export function useUploadForm() {
    // Form Inputs
    const [title, setTitle] = useState("");
    const [fieldQuery, setFieldQuery] = useState("");
    const [selectedFieldId, setSelectedFieldId] = useState("");
    const [lessonQuery, setLessonQuery] = useState("");
    const [selectedLessonId, setSelectedLessonId] = useState("");
    const [resourceType, setResourceType] = useState<"midterm" | "final" | "pamphlet">("midterm");
    const [semester, setSemester] = useState<"fall" | "spring" | "summer">("fall");
    const [year, setYear] = useState<number>(CURRENT_YEAR);
    const [file, setFile] = useState<File | null>(null);

    // Lists & Autocomplete State
    const [allFields, setAllFields] = useState<IField[]>([]);
    const [allLessons, setAllLessons] = useState<ILesson[]>([]);
    const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
    const [lessonDropdownOpen, setLessonDropdownOpen] = useState(false);

    // Status / UX State
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch Fields on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fieldsRes = await fetch("/api/fields");

                if (fieldsRes.ok && lessonsRes.ok) {
                    const fieldsData: IField[] = await fieldsRes.json();
                    const lessonsData: ILesson[] = await lessonsRes.json();
                    setAllFields(fieldsData);
                    setAllLessons(lessonsData);

                    // Prefill from URL parameters (e.g. ?field=mathematics&lesson=functions)
                    if (typeof window !== "undefined") {
                        const params = new URLSearchParams(window.location.search);
                        const fieldParam = params.get("field");
                        const lessonParam = params.get("lesson");

                        if (fieldParam) {
                            const matchedField = fieldsData.find(
                                f => f.name.toLowerCase() === fieldParam.toLowerCase() ||
                                    f.slug.toLowerCase() === fieldParam.toLowerCase()
                            );
                            if (matchedField) {
                                setFieldQuery(matchedField.name);
                                setSelectedFieldId(matchedField._id);

                                if (lessonParam) {
                                    const matchedLesson = lessonsData.find(
                                        l => l.field === matchedField._id && (
                                            l.name.toLowerCase() === lessonParam.toLowerCase() ||
                                            l.slug.toLowerCase() === lessonParam.toLowerCase()
                                        )
                                    );
                                    if (matchedLesson) {
                                        setLessonQuery(matchedLesson.name);
                                        setSelectedLessonId(matchedLesson._id);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load field autocomplete items:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const lessonsUrl = selectedFieldId
                    ? `/api/lessons?fieldId=${encodeURIComponent(selectedFieldId)}`
                    : "/api/lessons";
                const lessonsRes = await fetch(lessonsUrl);

                if (!lessonsRes.ok) {
                    throw new Error("Failed to load lessons.");
                }

                const lessonsData = await lessonsRes.json();
                setAllLessons(lessonsData);
            } catch (err) {
                console.error("Failed to load lessons:", err);
                setAllLessons([]);
            }
        };

        fetchLessons();
    }, [selectedFieldId]);

    // Filtered fields based on query
    const filteredFields = useMemo(() => {
        if (!fieldQuery.trim()) return allFields;
        return allFields.filter(f =>
            f.name.toLowerCase().includes(fieldQuery.toLowerCase())
        );
    }, [allFields, fieldQuery]);

    // Filtered lessons based on query AND selected field
    const filteredLessons = useMemo(() => {
        let lessons = allLessons;

        if (selectedFieldId) {
            lessons = lessons.filter(l => getLessonFieldId(l) === selectedFieldId);
        }

        if (!lessonQuery.trim()) return lessons;
        return lessons.filter(l =>
            l.name.toLowerCase().includes(lessonQuery.toLowerCase())
        );
    }, [allLessons, lessonQuery, selectedFieldId]);

    const selectField = (field: IField) => {
        setFieldQuery(field.name);
        setSelectedFieldId(field._id);
        setFieldDropdownOpen(false);
        setError(null);

        if (selectedLessonId) {
            const lesson = allLessons.find(l => l._id === selectedLessonId);
            if (lesson && getLessonFieldId(lesson) !== field._id) {
                setLessonQuery("");
                setSelectedLessonId("");
            }
        }
    };

    const selectLesson = (lesson: ILesson) => {
        setLessonQuery(lesson.name);
        setSelectedLessonId(lesson._id);
        setLessonDropdownOpen(false);
        setError(null);

        if (!selectedFieldId) {
            const parentField = allFields.find(f => f._id === getLessonFieldId(lesson));
            if (parentField) {
                setFieldQuery(parentField.name);
                setSelectedFieldId(parentField._id);
            }
        }
    };

    const handleFieldBlur = () => {
        setTimeout(() => {
            const exactMatch = allFields.find(
                f => f.name.toLowerCase() === fieldQuery.trim().toLowerCase()
            );

            if (exactMatch) {
                setSelectedFieldId(exactMatch._id);
                setFieldQuery(exactMatch.name);
            } else {
                if (fieldQuery.trim() !== "") {
                    setError("Please select a Field of Study from the options.");
                }
                setFieldQuery("");
                setSelectedFieldId("");
            }
            setFieldDropdownOpen(false);
        }, 200);
    };

    const handleLessonBlur = () => {
        setTimeout(() => {
            let validLessons = allLessons;
            if (selectedFieldId) {
                validLessons = allLessons.filter(l => getLessonFieldId(l) === selectedFieldId);
            }

            const exactMatch = validLessons.find(
                l => l.name.toLowerCase() === lessonQuery.trim().toLowerCase()
            );

            if (exactMatch) {
                setSelectedLessonId(exactMatch._id);
                setLessonQuery(exactMatch.name);
            } else {
                if (lessonQuery.trim() !== "") {
                    setError("Please select a Lesson/Topic from the options.");
                }
                setLessonQuery("");
                setSelectedLessonId("");
            }
            setLessonDropdownOpen(false);
        }, 200);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        setError(null);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            const validTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

            if (validTypes.includes(droppedFile.type) || droppedFile.name.endsWith(".pdf") || droppedFile.name.endsWith(".txt") || droppedFile.name.endsWith(".docx")) {
                setFile(droppedFile);
            } else {
                setError("Invalid file type. Only PDF, DOCX, and TXT are supported.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const resetFormFields = () => {
        setTitle("");
        setFieldQuery("");
        setSelectedFieldId("");
        setLessonQuery("");
        setSelectedLessonId("");
        setResourceType("midterm");
        setSemester("fall");
        setYear(CURRENT_YEAR);
        setFile(null);
    };

    const handleCancel = () => {
        resetFormFields();
        setError(null);
        setSuccess(null);
    };

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title.trim()) {
            setError("Document title is required.");
            return;
        }
        if (!selectedFieldId) {
            setError("Please select a valid Field of Study from the suggestions.");
            return;
        }
        if (!selectedLessonId) {
            setError("Please select a valid Lesson / Topic from the suggestions.");
            return;
        }
        if (!file) {
            setError("Please choose a file to upload.");
            return;
        }

        setUploading(true);

        try {
            const fileData = await getBase64(file);

            // Match exactly what the backend (pages/api/files.ts) expects
            const payload = {
                title,
                lesson: selectedLessonId,
                type: resourceType,
                semester,
                year,
                file: {
                    data: fileData,
                    filename: file.name,
                }
            };

            const token = localStorage.getItem("token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("/api/files", {
                method: "POST",
                headers,
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                resetFormFields();
                setSuccess(`Successfully uploaded: "${data.title}"!`);
            } else {
                setError(data.message || "Failed to upload file.");
            }
        } catch (err: unknown) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return {
        title, setTitle,
        fieldQuery, setFieldQuery,
        selectedFieldId,
        lessonQuery, setLessonQuery,
        selectedLessonId,
        resourceType, setResourceType,
        semester, setSemester,
        year, setYear,
        file, setFile,
        fieldDropdownOpen, setFieldDropdownOpen,
        lessonDropdownOpen, setLessonDropdownOpen,
        dragging, uploading, error, success,
        filteredFields, filteredLessons,
        selectField, selectLesson,
        handleFieldBlur, handleLessonBlur,
        handleDragOver, handleDragLeave,
        handleDrop, handleFileChange,
        handleCancel, handleSubmit,
        YEARS, SEMESTERS,
    };
}
