"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { deleteListingImage } from "@/lib/api/listingImages";
import { createClient } from "@/lib/supabase/client";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";

const supabase = createClient();

export type SupabaseImage = {
  url: string;
  name: string;
  alt?: string;
  id?: number; // optional backend image ID for deletes
};

export type SupabaseImageManagerProps = {
  initialImages?: SupabaseImage[];
  bucket?: string;
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  onChange?: (images: SupabaseImage[]) => void;
  isWatermark?: boolean;
  onUploadSuccess?: (url: string) => void;
  onDeleteSuccess?: () => void;
  watermarkUrl?: string;
};

const SupabaseImageManager: React.FC<SupabaseImageManagerProps> = (props) => {
  const {
    initialImages = [],
    bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
      "listing-images",
    folder = "uploads",
    maxFiles = 30,
    maxFileSize = 10 * 1024 * 1024,
    onChange,
    isWatermark = false,
    onUploadSuccess,
    onDeleteSuccess,
    watermarkUrl,
  } = props;

  // Track uploaded images from SupabaseImageManager
  const [images, setImages] = useState<SupabaseImage[]>(initialImages);
  const t = useTranslations("SupabaseImageManager");
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  // Sync images state with initialImages prop changes (for edit mode)
  React.useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);
  const [dropzoneKey, setDropzoneKey] = useState(0); // Add key to force Dropzone reset
  const upload = useSupabaseUpload({
    bucketName: bucket,
    path: folder,
    allowedMimeTypes: isWatermark ? ["image/png"] : ["image/*"],
    maxFiles: maxFiles - images.length,
    maxFileSize,
    upsert: false,
    watermarkUrl,
    isWatermark,
  });

  // Handle upload success
  React.useEffect(() => {
    if (upload.isSuccess && upload.successes.length > 0) {
      // Only add images that are not already present in the images state
      const newImages = upload.files
        .filter(
          (file: { name: string }) =>
            upload.successes.includes(file.name) &&
            !images.some((img) => img.name === file.name)
        )
        .map((file: { name: string; url?: string }) => {
          // Construct public URL if missing
          let url = file.url;
          if (!url || url === "") {
            url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${folder}/${file.name}`;
          }
          return {
            url,
            name: file.name,
          };
        });
      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
        onChange?.([...images, ...newImages]);
        // Call upload success callback with the new image URL (for watermark, only one image)
        if (isWatermark && onUploadSuccess) {
          onUploadSuccess(newImages[0].url);
        }
      }
      // Clear all upload hook state to allow new uploads
      upload.setFiles([]);
      upload.setErrors([]);
      upload.setSuccesses([]);
      setDropzoneKey((prev) => prev + 1);
    }
  }, [upload.isSuccess, upload.successes]);

  // Handle alt text change
  const handleAltChange = (idx: number, alt: string) => {
    const updated = images.map((img, i) => (i === idx ? { ...img, alt } : img));
    setImages(updated);
    onChange?.(updated);
  };

  // Delete image from Supabase Storage and local state
  const handleDelete = async (idx: number) => {
    setDeletingIdx(idx);
    const img = images[idx];

    // If image has backend ID, delete from backend
    if (img.id) {
      try {
        await deleteListingImage(img.id);
      } catch (err) {
        console.error("Failed to delete image from backend DB:", err);
      }
    }

    // Extract path from URL (this is the correct method)
    const urlPath = img.url.split(
      "/storage/v1/object/public/" + bucket + "/"
    )[1];

    // Delete from Supabase Storage
    const res = await supabase.storage.from(bucket).remove([urlPath]);

    if (res.error) {
      console.error("Delete error details:", {
        message: res.error.message,
        error: res.error,
      });
      setDeletingIdx(null);
      return; // Don't proceed if deletion failed
    }

    // Remove from UI state
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    onChange?.(updated);
    // Call delete success callback (for watermark)
    if (isWatermark && onDeleteSuccess) {
      onDeleteSuccess();
    }

    // Clear all upload hook state in the correct order
    upload.setFiles([]);
    upload.setErrors([]);
    upload.setSuccesses([]);

    // Force Dropzone to reset by changing its key
    setDropzoneKey((prev) => prev + 1);

    // Wait a moment then log the final state to verify clearing worked
    setTimeout(() => {
      setDeletingIdx(null);
    }, 100);
  };

  // --- dnd-kit sortable setup ---
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id);
      const newIndex = images.findIndex((img) => img.url === over.id);
      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
      onChange?.(newImages);
    }
  }

  function SortableImageCard({
    img,
    idx,
  }: {
    img: SupabaseImage;
    idx: number;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: img.url });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          zIndex: isDragging ? 10 : undefined,
        }}
        className="relative flex flex-col items-center w-40 border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden group"
        {...attributes}
      >
        <div
          className="w-full h-28 bg-slate-100 flex items-center justify-center overflow-hidden cursor-move"
          {...listeners}
        >
          <Image
            src={img.url}
            alt={img.alt || img.name}
            width={160}
            height={112}
            className="object-cover w-full h-full"
            style={{ width: "auto", height: "auto" }}
            unoptimized={false}
          />
        </div>
        <div className="flex flex-col w-full px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span
              className="truncate text-xs font-medium text-slate-700 max-w-[100px]"
              title={img.name}
            >
              {img.name}
            </span>
            <button
              type="button"
              className={`text-slate-400 hover:text-red-500 ml-2 cursor-pointer ${
                deletingIdx === idx ? "opacity-60 pointer-events-none" : ""
              }`}
              onClick={() => handleDelete(idx)}
              title={t("delete_image_tooltip")}
              disabled={deletingIdx === idx}
            >
              {deletingIdx === idx ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
          <span className="text-xs text-slate-400">
            {(() => {
              const uploaded = upload.files.find(
                (f: { name: string; size?: number }) => f.name === img.name
              );
              return uploaded && uploaded.size
                ? `${Math.round(uploaded.size / 1024 / 1024)} MB`
                : "";
            })()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.url)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <SortableImageCard key={img.url} img={img} idx={idx} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {/* Dropzone for new uploads - use Supabase UI blocks */}
      <div className="mb-2 w-full max-w-xl">
        <Dropzone key={dropzoneKey} {...upload} isWatermark={isWatermark}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    </div>
  );
};

export default SupabaseImageManager;
