import { renderHook, act } from "@testing-library/react";
import { useBooksPage } from "@/hooks/useBooksPage";

describe("useBooksPage Hook", () => {
  it("initializes with default subject filter and empty search query", () => {
    const { result } = renderHook(() => useBooksPage());

    expect(result.current.selectedSubject).toBe("All");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.books.length).toBeGreaterThan(0);
  });

  it("filters books by subject category", () => {
    const { result } = renderHook(() => useBooksPage());

    act(() => {
      result.current.setSelectedSubject("Mathematics");
    });

    expect(result.current.selectedSubject).toBe("Mathematics");
    expect(result.current.books.every(b => b.subject === "Mathematics")).toBe(true);
  });

  it("filters books by search query", () => {
    const { result } = renderHook(() => useBooksPage());

    act(() => {
      result.current.setSearchQuery("Algorithms");
    });

    expect(result.current.books.length).toBe(1);
    expect(result.current.books[0].title).toContain("Algorithms");
  });
});
