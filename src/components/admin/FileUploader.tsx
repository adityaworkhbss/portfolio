"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  value?: string;
  onUpload: (url: string) => void;
  folder?: string;
  className?: string;
  accept?: string;
  label?: string;
}

export default function FileUploader({
  value,
  onUpload,
  folder = "uploads",
  className,
  accept = ".pdf,.doc,.docx",
  label = "PDF or Document",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadToCloudinary(file, folder, setProgress);
        onUpload(url);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div className="relative p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Resume.pdf</p>
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-zinc-500 hover:text-[var(--accent)] transition-colors"
              >
                View current file
              </a>
            </div>
          </div>
          <button
            onClick={() => onUpload("")}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-white/10 hover:border-[var(--accent)]/30 bg-white/[0.02] cursor-pointer transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload size={24} className="text-zinc-500 group-hover:text-[var(--accent)]" />
          </div>
          {uploading ? (
            <div className="text-center px-4">
               <div className="w-32 h-1 bg-zinc-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-400">Uploading {Math.round(progress)}%</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-white">Click or drag to upload resume</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </>
          )}
          <input type="file" accept={accept} className="hidden" onChange={handleSelect} disabled={uploading} />
        </label>
      )}
    </div>
  );
}
