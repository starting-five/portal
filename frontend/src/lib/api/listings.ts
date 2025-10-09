import { API_BASE } from "./apiBase";

export async function getListings(params?: {
  lang?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
  locationId?: string;
  propertyTypeId?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  ownershipTypeId?: string;
  listingStatusId?: string;
  featuresId?: string;
}) {
  const queryParams = [];
  if (params?.lang) queryParams.push(`lang=${params.lang}`);
  if (params?.user_id) queryParams.push(`user_id=${params.user_id}`);
  if (params?.limit) queryParams.push(`limit=${params.limit}`);
  if (params?.offset !== undefined) queryParams.push(`offset=${params.offset}`);
  if (params?.locationId) queryParams.push(`locationId=${params.locationId}`);
  if (params?.propertyTypeId)
    queryParams.push(`propertyTypeId=${params.propertyTypeId}`);
  if (params?.bedrooms !== undefined)
    queryParams.push(`bedrooms=${params.bedrooms}`);
  if (params?.bathrooms !== undefined)
    queryParams.push(`bathrooms=${params.bathrooms}`);
  if (params?.minPrice !== undefined)
    queryParams.push(`minPrice=${params.minPrice}`);
  if (params?.maxPrice !== undefined)
    queryParams.push(`maxPrice=${params.maxPrice}`);
  if (params?.ownershipTypeId !== undefined)
    queryParams.push(`ownershipTypeId=${params.ownershipTypeId}`);
  if (params?.listingStatusId !== undefined)
    queryParams.push(`listingStatusId=${params.listingStatusId}`);
  if (params?.featuresId !== undefined)
    queryParams.push(`featuresId=${params.featuresId}`);
  const query = queryParams.length ? `?${queryParams.join("&")}` : "";
  const res = await fetch(`${API_BASE}/listings${query}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    console.error(res.status, res.statusText);
    throw new Error("Failed to fetch listings");
  }
  return res.json();
}

export async function getListing(listing_id: string) {
  const res = await fetch(`${API_BASE}/listings/${listing_id}`);
  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export async function getImagesForListing(listingId: string | number) {
  const res = await fetch(`${API_BASE}/listings/${listingId}/images`);
  if (!res.ok) throw new Error("Failed to fetch images for listing");
  return res.json();
}

export async function createListing(data: unknown, jwt?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing");
  return res.json();
}

export async function updateListing(
  listing_id: string,
  data: unknown,
  jwt?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listings/${listing_id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}

export async function deleteListing(listing_id: string, jwt?: string) {
  const headers: Record<string, string> = {};
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listings/${listing_id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  if (res.status === 204) return;
  return res.json();
}
