import { useState, useMemo } from "react";

export interface Book {
    id: string;
    title: string;
    author: string;
    subject: string;
    description: string;
    coverColor: string;
    downloadUrl: string;
    rating: number;
}

const SAMPLE_BOOKS: Book[] = [
    {
        id: "1",
        title: "Calculus & Analytical Geometry",
        author: "Prof. George Thomas",
        subject: "Mathematics",
        description: "Comprehensive guide covering limits, derivatives, integrals, and vector calculus.",
        coverColor: "bg-blue-600",
        downloadUrl: "#",
        rating: 4.9
    },
    {
        id: "2",
        title: "Introduction to Algorithms (CLRS)",
        author: "Cormen, Leiserson, Rivest, Stein",
        subject: "Computer Science",
        description: "The gold standard textbook on algorithms, data structures, and computational complexity.",
        coverColor: "bg-indigo-700",
        downloadUrl: "#",
        rating: 4.95
    },
    {
        id: "3",
        title: "University Physics with Modern Physics",
        author: "Young & Freedman",
        subject: "Physics",
        description: "Classical mechanics, thermodynamics, electromagnetism, and quantum mechanics fundamentals.",
        coverColor: "bg-red-600",
        downloadUrl: "#",
        rating: 4.85
    },
    {
        id: "4",
        title: "Organic Chemistry",
        author: "Paula Yurkanis Bruice",
        subject: "Chemistry",
        description: "Mechanisms, synthesis pathways, and molecular structures in modern organic chemistry.",
        coverColor: "bg-emerald-600",
        downloadUrl: "#",
        rating: 4.8
    },
    {
        id: "5",
        title: "Linear Algebra & Its Applications",
        author: "David C. Lay",
        subject: "Mathematics",
        description: "Vector spaces, matrices, linear transformations, eigenvalues, and applications.",
        coverColor: "bg-sky-600",
        downloadUrl: "#",
        rating: 4.9
    },
    {
        id: "6",
        title: "Operating System Concepts",
        author: "Silberschatz, Galvin, Gagne",
        subject: "Computer Science",
        description: "Processes, thread management, memory allocation, storage systems, and security.",
        coverColor: "bg-purple-700",
        downloadUrl: "#",
        rating: 4.75
    }
];

export function useBooksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState<string>("All");

    const subjects = useMemo(() => {
        return ["All", "Mathematics", "Computer Science", "Physics", "Chemistry"];
    }, []);

    const filteredBooks = useMemo(() => {
        return SAMPLE_BOOKS.filter(book => {
            const matchesSubject = selectedSubject === "All" || book.subject === selectedSubject;
            const matchesQuery = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSubject && matchesQuery;
        });
    }, [searchQuery, selectedSubject]);

    return {
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        subjects,
        books: filteredBooks
    };
}
