import { useState, useCallback } from 'react';

interface UsePdfPreviewResult {
  pdfUrl: string | null;
  isPdfOpen: boolean;
  openPdf: (drawingId: string) => void;
  closePdf: () => void;
}

export const usePdfPreview = (): UsePdfPreviewResult => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // In a real app, this would fetch the actual PDF URL from a backend
  // For this demo, we'll simulate it by constructing a mock URL
  const openPdf = useCallback((drawingId: string) => {
    // This is just a mock URL - in a real app you would get this from an API
    // or construct it based on your file storage system
    const mockPdfUrl = `https://example.com/drawings/${drawingId}.pdf`;
    setPdfUrl(mockPdfUrl);
    setIsPdfOpen(true);
  }, []);

  const closePdf = useCallback(() => {
    setIsPdfOpen(false);
    // Keep the URL for a moment to allow for transition animations
    setTimeout(() => setPdfUrl(null), 300);
  }, []);

  return {
    pdfUrl,
    isPdfOpen,
    openPdf,
    closePdf
  };
};