import type { SupabaseImage } from "@/components/SupabaseImageManager";
import { bulkCreateListingImages } from "@/lib/api/listingImages";
import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "listing-images";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Deletes all images in the user's tmp folder in Supabase Storage that match the uploadedImages list.
 */
export async function deleteUserTmpImages({
  supabase,
  userId,
  images,
  bucket = supabaseBucket,
}: {
  supabase: SupabaseClient;
  userId: string;
  images: { url: string }[];
  bucket?: string;
}): Promise<void> {
  const tmpImages = images.filter(
    (img) => img.url && img.url.includes("/tmp/")
  );
  if (!tmpImages.length) return;
  const paths = tmpImages
    .map((img) => {
      // Extract path after /storage/v1/object/public/${bucket}/
      const urlParts = img.url.split(`/storage/v1/object/public/${bucket}/`);
      return urlParts[1];
    })
    .filter(Boolean);
  if (paths.length) {
    await supabase.storage.from(bucket).remove(paths);
  }
}

/**
 * Moves images from tmp to final folder and creates DB records for a listing.
 * Used for both new and edit listing save workflows.
 */
export async function moveAndSaveListingImages({
  images,
  userId,
  listingId,
  jwt,
}: {
  images: SupabaseImage[];
  userId: string;
  listingId: string;
  jwt?: string;
}): Promise<SupabaseImage[]> {
  if (!images.length || !userId || !listingId) return images;
  const supabase = createClient();
  // Move images from tmp to final folder and get new URLs
  const movedImages = await Promise.all(
    images.map(async (img) => {
      let imageName = img.name;
      if (!imageName && img.url) {
        const parts = img.url.split("/");
        imageName = parts[parts.length - 1];
      }
      try {
        const newUrl = await moveListingImage({
          supabase,
          userId,
          listingId,
          imageName,
        });
        return { ...img, url: newUrl };
      } catch (err) {
        // Optionally handle error (e.g., toast)
        return img;
      }
    })
  );
  // Bulk create DB records
  const imagesToUpload = movedImages.map((img, idx) => ({
    listing_id: listingId,
    url: img.url,
    alt_text:
      typeof img.name === "string" && img.name.length > 0
        ? img.name
        : undefined,
    sort_order: idx,
  }));
  try {
    await bulkCreateListingImages(imagesToUpload, jwt);
  } catch (err) {
    // Optionally handle error (e.g., toast)
  }
  return movedImages;
}

/**
 * Moves an image from the temp folder to the final listing folder in Supabase Storage.
 * @param supabase - The authenticated Supabase client
 * @param userId - The user's UUID
 * @param listingId - The public listing_id (e.g., "0738-4250")
 * @param imageName - The image file name
 * @param bucket - The storage bucket
 * @returns The new public URL for the image
 */
export async function moveListingImage({
  supabase,
  userId,
  listingId,
  imageName,
  bucket = supabaseBucket,
}: {
  supabase: SupabaseClient;
  userId: string;
  listingId: string;
  imageName: string;
  bucket?: string;
}): Promise<string> {
  const fromPath = `uploads/${userId}/tmp/${imageName}`;
  const toPath = `uploads/${userId}/${listingId}/${imageName}`;

  // Check if source file exists in tmp folder
  const tmpFolder = `uploads/${userId}/tmp`;
  const { data: tmpFiles, error: tmpListError } = await supabase.storage
    .from(bucket)
    .list(tmpFolder);
  if (tmpListError) {
    console.error("Error listing tmp files:", tmpListError.message);
  } else {
    const exists = tmpFiles?.some((f) => f.name === imageName);

    if (!exists) {
      // Check for similar names (case issues, encoding, etc.)
      const similarFiles = tmpFiles?.filter(
        (f) =>
          f.name.toLowerCase().includes(imageName.toLowerCase()) ||
          imageName.toLowerCase().includes(f.name.toLowerCase())
      );
      throw new Error(`Source file ${imageName} does not exist in tmp folder.`);
    }
  }

  // Ensure destination folder exists by uploading a placeholder if needed
  const destinationFolder = `uploads/${userId}/${listingId}`;
  const { data: destFiles, error: destListError } = await supabase.storage
    .from(bucket)
    .list(destinationFolder);

  if (destListError && destListError.message.includes("not found")) {
    // Create the folder by uploading a small placeholder file
    const placeholderPath = `${destinationFolder}/.placeholder`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(placeholderPath, new Blob([""], { type: "text/plain" }));

    if (uploadError) {
      console.error("Failed to create destination folder:", uploadError);
    }
  } else if (destListError) {
    console.error("Error checking destination folder:", destListError);
  }

  // Test SELECT permission first
  const { data: testFile, error: selectError } = await supabase.storage
    .from(bucket)
    .download(fromPath);
  if (selectError) {
    console.error("SELECT permission failed:", selectError);
  }

  // Test current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase.storage
    .from(bucket)
    .move(fromPath, toPath);
  if (error) {
    console.error("Move operation failed:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to move image: ${error.message}`);
  }

  // Check if file exists at new path
  const folderPath = `uploads/${userId}/${listingId}`;
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath);
  if (listError) {
    console.error("Error listing files:", listError.message);
  } else {
    const found = files?.some((f) => f.name === imageName);
    if (!found) {
      console.warn(`File ${imageName} not found at ${folderPath} after move.`);
    }
  }

  // Construct new public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${toPath}`;
  return publicUrl;
}

/**
 * Deletes all images in a listing's folder in Supabase Storage.
 * @param supabase - The authenticated Supabase client
 * @param userId - The user's UUID
 * @param listingId - The public listing_id (e.g., "0738-4250")
 * @param bucket - The storage bucket
 */
export async function deleteListingImagesFolder({
  supabase,
  userId,
  listingId,
  bucket = supabaseBucket,
}: {
  supabase: SupabaseClient;
  userId: string;
  listingId: string;
  bucket?: string;
}): Promise<void> {
  const folderPath = `uploads/${userId}/${listingId}`;
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath);
  if (listError) {
    console.error("Error listing files for deletion:", listError.message);
    return;
  }
  if (!files || files.length === 0) {
    return;
  }
  const filePaths = files.map((f) => `${folderPath}/${f.name}`);
  const { error: deleteError } = await supabase.storage
    .from(bucket)
    .remove(filePaths);
  if (deleteError) {
    console.error("Error deleting files:", deleteError.message);
  }
}
