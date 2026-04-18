"use client";

import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onUpload: (url: string) => void;
  folder?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onUpload,
  folder = "uploads",
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;

      setUploading(true);
      setPreview(URL.createObjectURL(file));

      try {
        const url = await uploadToCloudinary(file, folder, setProgress);
        onUpload(url);
      } catch (error) {
        console.error("Upload failed:", error);
        setPreview(value || null);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onUpload, value]
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
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[16/9]">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-2">{Math.round(progress)}%</p>
              </div>
            </div>
          )}
          {!uploading && (
            <button
              onClick={() => {
                setPreview(null);
                onUpload("");
              }}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg hover:bg-black/70 transition-colors cursor-pointer"
            >
              <X size={14} className="text-white" />
            </button>
          )}
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center aspect-[16/9] rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/[0.02] cursor-pointer transition-colors"
        >
          <ImageIcon size={24} className="text-zinc-600 mb-2" />
          <p className="text-sm text-zinc-500">Drop image or click to upload</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleSelect} />
        </label>
      )}
    </div>
  );
}
