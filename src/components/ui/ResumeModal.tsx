"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeModalProps {
  resumeUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({
  resumeUrl,
  isOpen,
  onClose,
}: ResumeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  useEffect(() => setMounted(true), []);

  // Close on Escape key & lock scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, pageCount));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(p - 1, 1));
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, pageCount]);

  // Fetch page count from our API when modal opens
  useEffect(() => {
    if (!isOpen || !resumeUrl) return;
    setCurrentPage(1);
    setLoadedPages(new Set());

    const params = new URLSearchParams({ url: resumeUrl });
    fetch(`/api/resume?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.pages) setPageCount(data.pages);
      })
      .catch(() => setPageCount(1));
  }, [isOpen, resumeUrl]);

  /**
   * Build a Cloudinary URL that renders a specific PDF page as a high-quality image.
   */
  const getPageImageUrl = useCallback(
    (page: number) => {
      if (resumeUrl.includes("/upload/")) {
        return resumeUrl
          .replace("/upload/", `/upload/pg_${page},w_1200,q_auto:best/`)
          .replace(/\.pdf$/i, ".jpg");
      }
      return resumeUrl;
    },
    [resumeUrl]
  );

  const handleDownload = useCallback(() => {
    const params = new URLSearchParams({ url: resumeUrl, download: "true" });
    window.open(`/api/resume?${params.toString()}`, "_blank");
  }, [resumeUrl]);

  const handlePageLoad = useCallback((page: number) => {
    setLoadedPages((prev) => new Set(prev).add(page));
  }, []);

  if (!mounted) return null;

  const isCurrentPageLoaded = loadedPages.has(currentPage);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl h-[88vh] flex flex-col rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0c0d0f] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#0a0b0c]/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-[var(--accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    Resume
                  </p>
                  {pageCount > 1 && (
                    <p className="mono text-[10px] text-zinc-500 tracking-wide">
                      Page {currentPage} of {pageCount}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Download</span>
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── PDF Pages Viewer ── */}
            <div className="flex-1 relative overflow-auto bg-zinc-900/50">
              {/* Loading spinner */}
              {!isCurrentPageLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-zinc-950/80">
                  <div className="w-10 h-10 rounded-full border-2 border-white/[0.08] border-t-[var(--accent)] animate-spin" />
                  <p className="mono text-[11px] text-zinc-500 tracking-wide">
                    Loading page {currentPage}…
                  </p>
                </div>
              )}

              {/* Rendered page image */}
              <div className="flex justify-center p-4 sm:p-6 md:p-8">
                <img
                  key={currentPage}
                  src={getPageImageUrl(currentPage)}
                  alt={`Resume page ${currentPage}`}
                  className={cn(
                    "max-w-full h-auto rounded-lg shadow-2xl border border-white/[0.06] transition-opacity duration-300",
                    isCurrentPageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => handlePageLoad(currentPage)}
                  draggable={false}
                />
              </div>
            </div>

            {/* ── Footer with navigation ── */}
            <div className="flex items-center justify-center px-5 sm:px-6 py-3 border-t border-white/[0.08] bg-[#0a0b0c]/80 shrink-0">
              {pageCount > 1 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="mono text-[11px] text-zinc-400 min-w-[3.5rem] text-center">
                    {currentPage} / {pageCount}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, pageCount))
                    }
                    disabled={currentPage >= pageCount}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                <p className="mono text-[10px] text-zinc-600 tracking-wide">
                  Press ESC to close
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
