// Utility to convert image to WebP via API
export async function convertImageToWebP(file: File): Promise<File> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/convert-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image conversion failed');
  }

  const blob = await response.blob();
  // Create a new File object for Supabase upload
  return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
    type: 'image/webp',
    lastModified: Date.now(),
  });
}
