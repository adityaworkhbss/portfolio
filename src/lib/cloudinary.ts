export async function uploadToCloudinary(
  file: File,
  folder: string = "portfolio",
  onProgress?: (progress: number) => void,
  resourceType?: "image" | "raw" | "video" | "auto"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary configuration in .env.local");
  }

  // Auto-detect resource type: PDFs and documents should use 'raw'
  const detectedType = resourceType ?? getResourceType(file);
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${detectedType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `portfolio/${folder}`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress?.(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        const errorMsg = JSON.parse(xhr.responseText)?.error?.message || xhr.statusText;
        reject(new Error(`Upload failed: ${errorMsg}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

/** Map file MIME types to Cloudinary resource types */
function getResourceType(file: File): "image" | "raw" | "video" | "auto" {
  const mime = file.type.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  // PDFs → upload as 'image' (Cloudinary renders PDF pages as images)
  // This keeps them publicly accessible and allows transformations
  if (mime === "application/pdf") return "image";
  // Other docs → raw
  if (
    mime.includes("document") ||
    mime.includes("spreadsheet") ||
    mime.includes("presentation") ||
    mime.includes("msword") ||
    mime.includes("officedocument")
  ) {
    return "raw";
  }
  return "auto";
}
