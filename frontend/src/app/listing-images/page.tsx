import DeleteListingImageButton from "@/components/DeleteListingImageButton";
import { getListingImages } from "@/lib/api/listingImages";
import { ListingImage } from "@/lib/types";
import Link from "next/link";

export default async function ListingImagesPage() {
  const images = await getListingImages();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Listing Images</h1>
      <Link
        href="/listing-images/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Listing Image
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Listing ID</th>
            <th className="border px-4 py-2">Image URL</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img: ListingImage) => (
            <tr key={img.id}>
              <td className="border px-4 py-2">{img.listing_id}</td>
              <td className="border px-4 py-2">
                <a
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {img.url}
                </a>
              </td>
              <td className="border px-4 py-2">
                <Link
                  href={`/listing-images/${img.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteListingImageButton id={img.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
