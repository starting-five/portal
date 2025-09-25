"use client";

import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/ui/Spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getListings } from "@/lib/api/listings";
import { PAGINATION } from "@/lib/app.constants";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function ListingsLoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full min-h-[70vh]">
      <Spinner size={40} />
    </div>
  );
}

export default function ListingsGridClient({
  locale,
  searchParams,
  listingStatusIds,
  userId,
  emptyLabelKey = "empty",
  context,
}: {
  locale: string;
  searchParams: Record<string, string | string[]>;
  listingStatusIds: string | number | Array<string | number>;
  userId?: string;
  emptyLabelKey?: string;
  context?: string;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const t = useTranslations("MyListings");
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = PAGINATION.LISTINGS_PAGE_SIZE;

  // Parse page from searchParams or URL
  useEffect(() => {
    let pageParam = 1;
    if (searchParams.page) {
      if (Array.isArray(searchParams.page)) {
        pageParam = Number(searchParams.page[0]) || 1;
      } else {
        pageParam = Number(searchParams.page) || 1;
      }
    } else if (search.get("page")) {
      pageParam = Number(search.get("page")) || 1;
    }
    setPage(pageParam);
  }, [searchParams, search]);

  // Fetch listings when page or locale changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setListings([]); // Clear listings for spinner
    setTotal(0);
    const offset = (page - 1) * limit;
    // Extract all filter params from searchParams
    function normalize(
      param: string | string[] | undefined
    ): string | undefined {
      if (Array.isArray(param)) return param.join(",");
      return param;
    }
    const locations = normalize(searchParams.locations);
    const types = normalize(searchParams.types);
    const bedrooms = searchParams.bedrooms
      ? Number(
          Array.isArray(searchParams.bedrooms)
            ? searchParams.bedrooms[0]
            : searchParams.bedrooms
        )
      : undefined;
    const bathrooms = searchParams.bathrooms
      ? Number(
          Array.isArray(searchParams.bathrooms)
            ? searchParams.bathrooms[0]
            : searchParams.bathrooms
        )
      : undefined;
    const minPrice = searchParams.minPrice
      ? Number(
          Array.isArray(searchParams.minPrice)
            ? searchParams.minPrice[0]
            : searchParams.minPrice
        )
      : undefined;
    const maxPrice = searchParams.maxPrice
      ? Number(
          Array.isArray(searchParams.maxPrice)
            ? searchParams.maxPrice[0]
            : searchParams.maxPrice
        )
      : undefined;
    const ownershipTypes = normalize(searchParams.ownershipTypes);
    const features = normalize(searchParams.features);
    getListings({
      lang: locale,
      limit,
      offset,
      user_id: userId,
      locationId: locations,
      propertyTypeId: types,
      bedrooms,
      bathrooms,
      minPrice,
      maxPrice,
      ownershipTypeId: ownershipTypes,
      listingStatusId: Array.isArray(listingStatusIds)
        ? listingStatusIds.map(String).join(",")
        : String(listingStatusIds),
      featuresId: features,
    }).then((response) => {
      if (isMounted) {
        setListings(response?.data || []);
        setTotal(response?.totalCount || 0);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [page, locale, listingStatusIds, searchParams]);

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  function buildPageQuery(newPage: number) {
    const params = new URLSearchParams(search.toString());
    params.set("page", String(newPage));
    return `?${params.toString()}`;
  }

  function handlePageChange(newPage: number) {
    startTransition(() => {
      router.push(buildPageQuery(newPage));
      setPage(newPage);
    });
  }

  if (loading) {
    return <ListingsLoadingSpinner />;
  }
  if (listings.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4">{t(emptyLabelKey)}</h2>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-6 w-full mx-auto place-content-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, 398px)",
          gridAutoRows: "1fr",
        }}
      >
        {listings.map((listing: any) => (
          <div key={listing.id} className="w-[398px] h-full flex flex-col">
            <PropertyCard
              property={listing}
              locale={locale}
              context={context}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={page > 1 ? buildPageQuery(page - 1) : undefined}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  style={
                    page === 1 ? { pointerEvents: "none", opacity: 0.5 } : {}
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>
              {/* Ellipses pagination logic */}
              {(() => {
                const items = [];
                const maxButtons = 7;
                if (totalPages <= maxButtons - 2) {
                  for (let i = 1; i <= totalPages; i++) {
                    items.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={i === page ? undefined : buildPageQuery(i)}
                          isActive={i === page}
                          aria-disabled={i === page}
                          tabIndex={i === page ? -1 : 0}
                          style={
                            i === page
                              ? { pointerEvents: "none", opacity: 0.5 }
                              : {}
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            if (i !== page) handlePageChange(i);
                          }}
                        >
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return items;
                }
                items.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      href={page === 1 ? undefined : buildPageQuery(1)}
                      isActive={page === 1}
                      aria-disabled={page === 1}
                      tabIndex={page === 1 ? -1 : 0}
                      style={
                        page === 1
                          ? { pointerEvents: "none", opacity: 0.5 }
                          : {}
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        if (page !== 1) handlePageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );
                let start = Math.max(2, page - 1);
                let end = Math.min(totalPages - 1, page + 1);
                if (page <= 3) {
                  start = 2;
                  end = 4;
                } else if (page >= totalPages - 2) {
                  start = totalPages - 3;
                  end = totalPages - 1;
                }
                if (start > 2) {
                  items.push(
                    <PaginationItem key="start-ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                for (let i = start; i <= end; i++) {
                  items.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={i === page ? undefined : buildPageQuery(i)}
                        isActive={i === page}
                        aria-disabled={i === page}
                        tabIndex={i === page ? -1 : 0}
                        style={
                          i === page
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (i !== page) handlePageChange(i);
                        }}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (end < totalPages - 1) {
                  items.push(
                    <PaginationItem key="end-ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                items.push(
                  <PaginationItem key={totalPages}>
                    <PaginationLink
                      href={
                        page === totalPages
                          ? undefined
                          : buildPageQuery(totalPages)
                      }
                      isActive={page === totalPages}
                      aria-disabled={page === totalPages}
                      tabIndex={page === totalPages ? -1 : 0}
                      style={
                        page === totalPages
                          ? { pointerEvents: "none", opacity: 0.5 }
                          : {}
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        if (page !== totalPages) handlePageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  href={
                    page < totalPages ? buildPageQuery(page + 1) : undefined
                  }
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : 0}
                  style={
                    page === totalPages
                      ? { pointerEvents: "none", opacity: 0.5 }
                      : {}
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
