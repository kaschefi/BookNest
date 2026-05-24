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
    field: string;
}

export function useUploadForm() {
    // Form Inputs
    const [title, setTitle] = useState("");
    const [fieldQuery, setFieldQuery] = useState("");
    const [selectedFieldId, setSelectedFieldId] = useState("");
    const [lessonQuery, setLessonQuery] = useState("");
    const [selectedLessonId, setSelectedLessonId] = useState("");
    const [resourceType, setResourceType] = useState<"midterm" | "final" | "pamphlet">("midterm");
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

    // Fetch Fields and Lessons on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fieldsRes, lessonsRes] = await Promise.all([
                    fetch("/api/fields"),
                    fetch("/api/lessons")
                ]);

                if (fieldsRes.ok && lessonsRes.ok) {
                    const fieldsData = await fieldsRes.json();
                    const lessonsData = await lessonsRes.json();
                    setAllFields(fieldsData);
                    setAllLessons(lessonsData);
                }
            } catch (err) {
                console.error("Failed to load autocomplete items:", err);
            }
        };

        fetchData();
    }, []);

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

        // If a field of study is selected, only show lessons under that field
        if (selectedFieldId) {
            lessons = lessons.filter(l => l.field === selectedFieldId);
        }

        if (!lessonQuery.trim()) return lessons;
        return lessons.filter(l =>
            l.name.toLowerCase().includes(lessonQuery.toLowerCase())
        );
    }, [allLessons, lessonQuery, selectedFieldId]);

    // Field selection handler
    const selectField = (field: IField) => {
        setFieldQuery(field.name);
        setSelectedFieldId(field._id);
        setFieldDropdownOpen(false);
        setError(null);

        // If the current lesson doesn't belong to this field, reset the lesson
        if (selectedLessonId) {
            const lesson = allLessons.find(l => l._id === selectedLessonId);
            if (lesson && lesson.field !== field._id) {
                setLessonQuery("");
                setSelectedLessonId("");
            }
        }
    };

    // Lesson selection handler
    const selectLesson = (lesson: ILesson) => {
        setLessonQuery(lesson.name);
        setSelectedLessonId(lesson._id);
        setLessonDropdownOpen(false);
        setError(null);

        // If no field is selected yet, automatically select the field for this lesson
        if (!selectedFieldId) {
            const parentField = allFields.find(f => f._id === lesson.field);
            if (parentField) {
                setFieldQuery(parentField.name);
                setSelectedFieldId(parentField._id);
            }
        }
    };

    // Enforce selection of existing fields/lessons on blur
    const handleFieldBlur = () => {
        // Small timeout to allow click event on dropdown options to fire first
        setTimeout(() => {
            const exactMatch = allFields.find(
                f => f.name.toLowerCase() === fieldQuery.trim().toLowerCase()
            );

            if (exactMatch) {
                setSelectedFieldId(exactMatch._id);
                setFieldQuery(exactMatch.name);
            } else {
                // Not found — reset
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
                validLessons = allLessons.filter(l => l.field === selectedFieldId);
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

    // Drag and Drop Handlers
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

    // Form Reset/Cancel
    const handleCancel = () => {
        setTitle("");
        setFieldQuery("");
        setSelectedFieldId("");
        setLessonQuery("");
        setSelectedLessonId("");
        setResourceType("midterm");
        setFile(null);
        setError(null);
        setSuccess(null);
    };

    // Helper to read file as base64 string
    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Submit Action
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
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

            const payload = {
                title,
                lesson: selectedLessonId,
                type: resourceType,
                fileData,
                fileName: file.name,
                mimeType: file.type,
                size: file.size
            };

            // Retrieve token from local storage (if custom JWT auth is used)
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
                setSuccess(`Successfully uploaded notes: "${data.title}"!`);
                // Reset form
                setTitle("");
                setFieldQuery("");
                setSelectedFieldId("");
                setLessonQuery("");
                setSelectedLessonId("");
                setResourceType("midterm");
                setFile(null);
            } else {
                setError(data.message || "Failed to upload file.");
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "An unexpected error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return {
        title,
        setTitle,
        fieldQuery,
        setFieldQuery,
        selectedFieldId,
        lessonQuery,
        setLessonQuery,
        selectedLessonId,
        resourceType,
        setResourceType,
        file,
        setFile,
        fieldDropdownOpen,
        setFieldDropdownOpen,
        lessonDropdownOpen,
        setLessonDropdownOpen,
        dragging,
        uploading,
        error,
        success,
        filteredFields,
        filteredLessons,
        selectField,
        selectLesson,
        handleFieldBlur,
        handleLessonBlur,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileChange,
        handleCancel,
        handleSubmit
    };
}
