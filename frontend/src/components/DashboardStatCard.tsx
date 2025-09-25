import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface DashboardStatCardProps {
  title: string;
  value?: number | string;
  subtitle?: string;
  color?: string; // e.g. "text-green-600"
  loading?: boolean;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  color = "text-green-600",
  loading = false,
}) => (
  <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm max-w-xs w-full flex flex-col px-6 py-5 min-h-[110px] transition-shadow duration-300 hover:shadow-lg justify-start">
    <span className="text-gray-500 text-base mb-2 font-medium">{title}</span>
    {loading ? (
      <Skeleton className="h-10 mb-1" />
    ) : (
      <span className="text-4xl font-bold mb-1 text-gray-900">{value}</span>
    )}
    {subtitle && (
      <span className={`${color} text-sm font-semibold mt-1`}>{subtitle}</span>
    )}
  </div>
);

export default DashboardStatCard;
