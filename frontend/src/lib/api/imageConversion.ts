import { API_BASE } from "./apiBase";

// Convert image to WebP using backend API
export async function convertImageToWebPBackend(
  file: File,
  watermarkUrl?: string
): Promise<{ blob: Blob; filename: string }> {
  const formData = new FormData();
  formData.append("image", file);

  if (watermarkUrl) {
    formData.append("watermarkUrl", watermarkUrl);
  }

  const response = await fetch(`${API_BASE}/convert_image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Image conversion failed");
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = file.name.replace(/\.[^.]+$/, ".webp");
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^";]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }
  const blob = await response.blob();
  return { blob, filename };
}
