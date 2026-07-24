import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAuthStatus } from "./useAuthStatus";
import { subjectStaticData } from "@/lib/subjectData";
import { triggerFileDownload } from "@/lib/download";

export interface MergedLesson {
    _id: string | null;
    name: string;
    description: string;
    index: number;
    slug: string;
}

export interface IResource {
    _id: string;
    title: string;
    type: "midterm" | "final" | "pamphlet";
    fileUrl: string;
    downloads: number;
    views: number;
    voteScore: number;
    year: number;
    semester: "fall" | "spring" | "summer";
    mimeType?: string;
    size?: number;
}

interface DbField {
    _id: string;
    name: string;
    slug: string;
}

interface DbLesson {
    _id: string;
    name: string;
    slug?: string;
}

export function useSubjectLessons() {
    const params = useParams();
    const { isLoggedIn } = useAuthStatus();
    const subjectSlug = (params && params.subject ? (params.subject as string) : "mathematics");

    // DB States
    const [, setFieldId] = useState<string | null>(null);
    const [fieldName, setFieldName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [dbLessons, setDbLessons] = useState<DbLesson[]>([]);

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const lessonsPerPage = 5;

    // Track previous subject or search query to reset pagination when changed
    const [prevQuery, setPrevQuery] = useState({ subjectSlug, searchQuery });
    if (prevQuery.subjectSlug !== subjectSlug || prevQuery.searchQuery !== searchQuery) {
        setPrevQuery({ subjectSlug, searchQuery });
        setCurrentPage(1);
    }

    // Modal/Drawer States
    const [selectedLesson, setSelectedLesson] = useState<MergedLesson | null>(null);
    const [resources, setResources] = useState<IResource[]>([]);
    const [loadingResources, setLoadingResources] = useState(false);
    const [activeTab, setActiveTab] = useState<"midterm" | "final" | "pamphlet">("midterm");
    const [userVotes, setUserVotes] = useState<Record<string, number>>({});

    // Fetch field metadata and lessons from MongoDB on mount with a snappy 1.2s timeout fallback
    useEffect(() => {
        const fetchFieldAndLessons = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1200);

            try {
                setLoading(true);
                const fieldsRes = await fetch("/api/fields", { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!fieldsRes.ok) throw new Error("Failed to load fields");
                
                const fields: DbField[] = await fieldsRes.json();
                const matchedField = fields.find(
                    (f) => f.slug.toLowerCase() === subjectSlug.toLowerCase()
                );

                if (matchedField) {
                    setFieldId(matchedField._id);
                    setFieldName(matchedField.name);

                    // Fetch lessons for this field with a secondary timeout
                    const lessonController = new AbortController();
                    const lessonTimeoutId = setTimeout(() => lessonController.abort(), 1000);
                    
                    try {
                        const lessonsRes = await fetch(`/api/lessons?fieldId=${matchedField._id}`, { 
                            signal: lessonController.signal 
                        });
                        clearTimeout(lessonTimeoutId);
                        
                        if (lessonsRes.ok) {
                            const lessons: DbLesson[] = await lessonsRes.json();
                            setDbLessons(lessons);
                        }
                    } catch {
                        clearTimeout(lessonTimeoutId);
                        console.warn("[MongoDB] Lessons fetch timed out or failed. Falling back to static mockup lessons.");
                    }
                } else {
                    // Fallback to capitalizing the slug if field is not found in MongoDB
                    const capitalized = subjectSlug
                        .split("-")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");
                    setFieldName(capitalized);
                }
            } catch (err: unknown) {
                clearTimeout(timeoutId);
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.warn("[MongoDB] Fields fetch timed out or failed. Falling back to static mockup lessons instantly. Error:", errorMessage);
                
                // Set default field name since MongoDB is blocked
                const capitalized = subjectSlug
                    .split("-")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                setFieldName(capitalized);
            } finally {
                setLoading(false);
            }
        };

        fetchFieldAndLessons();
    }, [subjectSlug]);

    // Compute merged mockup & DB lessons using useMemo instead of state + useEffect
    const mergedLessons = useMemo<MergedLesson[]>(() => {
        const staticData = subjectStaticData[subjectSlug] || {
            name: fieldName || "Subject",
            subtitle: "Explore all lessons and topics.",
            footerText: "Knowledge is power. Keep learning!",
            lessons: []
        };

        const merged: MergedLesson[] = [];
        const usedDbIds = new Set<string>();

        // 1. Map static lessons
        staticData.lessons.forEach((staticL) => {
            const matchedDb = dbLessons.find(
                (dbl) => dbl.name.trim().toLowerCase() === staticL.name.trim().toLowerCase()
            );

            if (matchedDb) {
                merged.push({
                    _id: matchedDb._id,
                    name: matchedDb.name,
                    description: staticL.description,
                    index: staticL.index,
                    slug: matchedDb.slug || staticL.name.toLowerCase().replace(/\s+/g, "-")
                });
                usedDbIds.add(matchedDb._id);
            } else {
                merged.push({
                    _id: null,
                    name: staticL.name,
                    description: staticL.description,
                    index: staticL.index,
                    slug: staticL.name.toLowerCase().replace(/\s+/g, "-")
                });
            }
        });

        // 2. Append un-matched database lessons
        let nextIndex = staticData.lessons.length > 0 
            ? Math.max(...staticData.lessons.map(l => l.index)) + 1 
            : 1;

        dbLessons.forEach((dbl) => {
            if (!usedDbIds.has(dbl._id)) {
                merged.push({
                    _id: dbl._id,
                    name: dbl.name,
                    description: `Explore dynamic notes, summaries, and sheets for ${dbl.name}.`,
                    index: nextIndex++,
                    slug: dbl.slug || dbl.name.toLowerCase().replace(/\s+/g, "-")
                });
            }
        });

        return merged.sort((a, b) => a.index - b.index);
    }, [dbLessons, subjectSlug, fieldName]);

    // Fetch resources when a lesson is selected
    useEffect(() => {
        let isMounted = true;
        const lessonId = selectedLesson?._id;

        const fetchLessonResources = async () => {
            if (!lessonId) {
                if (isMounted) setResources([]);
                return;
            }

            try {
                setLoadingResources(true);
                const res = await fetch(`/api/files?lessonId=${lessonId}`);
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setResources(data.resources || []);
                    
                    if (isLoggedIn && data.resources?.length > 0) {
                        const token = localStorage.getItem("token");
                        const votesMap: Record<string, number> = {};
                        await Promise.all(
                            data.resources.map(async (resource: IResource) => {
                                try {
                                    const voteRes = await fetch(`/api/files/${resource._id}/vote`, {
                                        headers: token ? { "Authorization": `Bearer ${token}` } : {}
                                    });
                                    if (voteRes.ok) {
                                        const voteData = await voteRes.json();
                                        votesMap[resource._id] = voteData.userVote || 0;
                                    }
                                } catch {
                                    // Ignore failed vote fetches
                                }
                            })
                        );
                        if (isMounted) {
                            setUserVotes(votesMap);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load resources:", err);
            } finally {
                if (isMounted) {
                    setLoadingResources(false);
                }
            }
        };

        fetchLessonResources();

        return () => {
            isMounted = false;
        };
    }, [selectedLesson, isLoggedIn]);

    // Search filtration
    const filteredLessons = mergedLessons.filter((lesson) => {
        const query = searchQuery.toLowerCase().trim();
        return (
            lesson.name.toLowerCase().includes(query) ||
            lesson.description.toLowerCase().includes(query)
        );
    });

    // Pagination Slicing
    const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
    const startIndex = (currentPage - 1) * lessonsPerPage;
    const paginatedLessons = filteredLessons.slice(startIndex, startIndex + lessonsPerPage);

    // Handle resource download
    const handleDownload = (resource: IResource) => {
        // Trigger download count increment in background
        fetch(`/api/files/${resource._id}/download`, { method: "POST" }).catch(() => {});
        
        // Increment local download state
        setResources(prev =>
            prev.map(r => r._id === resource._id ? { ...r, downloads: r.downloads + 1 } : r)
        );

        const fileName = `${resource.title.replace(/[^a-zA-Z0-9_\-]/g, "_")}.pdf`;
        triggerFileDownload(resource.fileUrl, fileName);
    };

    // Handle casting a vote
    const handleVote = async (resource: IResource, value: 1 | -1) => {
        if (!isLoggedIn) {
            alert("Please sign in to vote on notes!");
            return;
        }
        const token = localStorage.getItem("token");

        const currentVote = userVotes[resource._id] || 0;
        
        // Optimistic update
        let scoreChange: number = value;
        if (currentVote === value) {
            // Unvote
            scoreChange = -value;
            setUserVotes(prev => ({ ...prev, [resource._id]: 0 }));
        } else if (currentVote !== 0) {
            // Swap vote (e.g. upvote to downvote is a delta of -2)
            scoreChange = value * 2;
            setUserVotes(prev => ({ ...prev, [resource._id]: value }));
        } else {
            // First time voting
            setUserVotes(prev => ({ ...prev, [resource._id]: value }));
        }

        setResources(prev =>
            prev.map(r => r._id === resource._id ? { ...r, voteScore: r.voteScore + scoreChange } : r)
        );

        try {
            const voteVal = currentVote === value ? 0 : value; // support unvoting if clicked again
            const res = await fetch(`/api/files/${resource._id}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ value: voteVal })
            });

            if (!res.ok) throw new Error("Vote failed");
            const data = await res.json();
            // Sync with backend confirmed score
            setResources(prev =>
                prev.map(r => r._id === resource._id ? { ...r, voteScore: data.voteScore } : r)
            );
        } catch (err) {
            console.error("Failed to cast vote:", err);
            // Revert optimistic update on failure
            setResources(prev =>
                prev.map(r => r._id === resource._id ? { ...r, voteScore: r.voteScore - scoreChange } : r)
            );
            setUserVotes(prev => ({ ...prev, [resource._id]: currentVote }));
        }
    };

    // Static display configs
    const activeStatic = subjectStaticData[subjectSlug] || {
        name: fieldName || "Subject",
        subtitle: "Explore all lessons and topics.",
        footerText: "Knowledge is power. Keep learning!"
    };

    return {
        subjectSlug,
        fieldName,
        loading,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedLessons,
        filteredLessons,
        startIndex,
        lessonsPerPage,
        selectedLesson,
        setSelectedLesson,
        resources,
        setResources,
        loadingResources,
        activeTab,
        setActiveTab,
        userVotes,
        handleDownload,
        handleVote,
        activeStatic,
    };
}
