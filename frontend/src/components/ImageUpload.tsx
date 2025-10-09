import { Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
// Import Dropzone from shadcn/ui (adjust import path as needed)
// import { Dropzone } from "@shadcn/ui/dropzone";
// For now, use a placeholder if Dropzone is not installed

export interface ImageUploadFile {
  file: File;
  previewUrl: string;
  alt: string;
}

export interface ImageUploadProps {
  value: ImageUploadFile[];
  onChange: (files: ImageUploadFile[]) => void;
  maxImages?: number;
  maxFileSizeMB?: number;
  acceptedTypes?: string[];
}

const DEFAULT_MAX_IMAGES = 24;
const DEFAULT_MAX_FILE_SIZE_MB = 10;
const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxImages = DEFAULT_MAX_IMAGES,
  maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}) => {
  // Simulate loading state for progress circle demo
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  // File input ref for manual trigger
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    let newFiles: ImageUploadFile[] = [...value];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        newFiles.length >= maxImages ||
        !acceptedTypes.includes(file.type) ||
        file.size > maxFileSizeMB * 1024 * 1024
      ) {
        continue; // skip invalid
      }
      const previewUrl = URL.createObjectURL(file);
      newFiles.push({ file, previewUrl, alt: "" });
    }
    onChange(newFiles.slice(0, maxImages));
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Dropzone area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-200 p-8 mb-6 cursor-pointer ${
          value.length < maxImages
            ? "border-gray-300 bg-gray-50 hover:bg-gray-100"
            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        aria-disabled={value.length >= maxImages}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          multiple
          className="hidden"
          onChange={handleInputChange}
          disabled={value.length >= maxImages}
        />
        <span className="text-lg font-medium mb-1">
          Drag & drop or click to upload
        </span>
        <span className="text-sm text-gray-500 mb-2">
          (up to {maxImages} images, max {maxFileSizeMB}MB each)
        </span>
        {value.length >= maxImages && (
          <span className="text-sm text-red-500">
            Maximum number of images reached.
          </span>
        )}
      </div>
      {/* Thumbnails and alt text inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {value.map((img, idx) => (
          <div key={idx} className="relative group flex flex-col items-center">
            <div className="w-36 h-36 rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center relative">
              <img
                src={img.previewUrl}
                alt={img.alt || `Image ${idx + 1}`}
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
              />
              {/* Progress circle overlay (show on initial load) */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}
              {/* Remove button overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const newFiles = value.slice();
                  newFiles.splice(idx, 1);
                  onChange(newFiles);
                }}
                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-red-500 transition-colors duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={`Remove image ${idx + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {/* Alt text input */}
            <input
              type="text"
              placeholder="Alt text"
              value={img.alt}
              onChange={(e) => {
                const newFiles = value.slice();
                newFiles[idx] = { ...img, alt: e.target.value };
                onChange(newFiles);
              }}
              className="mt-2 w-24 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Alt text for image ${idx + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
