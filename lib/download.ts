/**
 * Triggers a browser file download for data URLs, blob URLs, or web URLs.
 */
export function triggerFileDownload(fileUrl: string, fileName: string = "note.pdf") {
    if (!fileUrl) return;

    const safeFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

    // 1. Data URL (base64)
    if (fileUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = safeFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    // 2. HTTP/HTTPS URL — fetch as blob to force file download dialog
    fetch(fileUrl)
        .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.blob();
        })
        .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = safeFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        })
        .catch(() => {
            // Fallback for CORS or network restrictions
            const link = document.createElement("a");
            link.href = fileUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.download = safeFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}
