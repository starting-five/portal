"use client";

import DashboardStatCard from "@/components/DashboardStatCard";
import { getListingCounts } from "@/lib/api/listingCounts";
import { LISTING_STATUS_IDS } from "@/lib/app.constants";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StatCardGridProps {
  locale: string;
  userId?: string;
  draftsLabel: string;
  activeLabel: string;
  archiveLabel: string;
}

const StatCardGrid: React.FC<StatCardGridProps> = ({
  locale,
  userId = "",
  draftsLabel,
  activeLabel,
  archiveLabel,
}) => {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      try {
        const countsResponse = await getListingCounts(userId);
        setCounts(countsResponse?.counts || {});
      } catch {
        setCounts({});
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, [userId]);

  const draftCount = LISTING_STATUS_IDS.DRAFT.reduce(
    (sum, id) => sum + (counts?.[String(id)] || 0),
    0
  );
  const activeCount = LISTING_STATUS_IDS.ACTIVE.reduce(
    (sum, id) => sum + (counts?.[String(id)] || 0),
    0
  );
  const archiveCount = LISTING_STATUS_IDS.ARCHIVE.reduce(
    (sum, id) => sum + (counts?.[String(id)] || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
      <Link
        href={`/${locale}/dashboard/listings/drafts`}
        className="group"
        tabIndex={0}
        aria-label={draftsLabel}
      >
        <DashboardStatCard
          title={draftsLabel}
          value={draftCount}
          loading={loading}
        />
      </Link>
      <Link
        href={`/${locale}/dashboard/listings/active`}
        className="group"
        tabIndex={0}
        aria-label={activeLabel}
      >
        <DashboardStatCard
          title={activeLabel}
          value={activeCount}
          loading={loading}
        />
      </Link>
      <Link
        href={`/${locale}/dashboard/listings/archive`}
        className="group"
        tabIndex={0}
        aria-label={archiveLabel}
      >
        <DashboardStatCard
          title={archiveLabel}
          value={archiveCount}
          loading={loading}
        />
      </Link>
    </div>
  );
};

export default StatCardGrid;
