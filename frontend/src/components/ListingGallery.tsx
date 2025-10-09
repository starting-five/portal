"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
const ListingGalleryLightbox = dynamic(
  () => import("./ListingGalleryLightbox"),
  { ssr: false }
);

export type ListingGalleryImage = {
  url: string;
  alt_text?: string;
};

interface ListingGalleryProps {
  images: ListingGalleryImage[];
  onMainImageLeft?: (left: number) => void;
  children?: React.ReactNode;
  onRowWidth?: (width: number) => void;
}

export default function ListingGallery({
  images,
  onMainImageLeft,
  children,
  onRowWidth,
}: ListingGalleryProps) {
  const t = useTranslations("ListingDetail");
  const [open, setOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const imgs = images || [];
  const mainImg = imgs[0];
  const thumbs = imgs.slice(1, 5); // Up to 4 thumbnails
  const thumbCols = [thumbs.slice(0, 2), thumbs.slice(2, 4)];

  const mainRef = useRef<HTMLDivElement | null>(null);
  const col1Ref = useRef<HTMLDivElement | null>(null);
  const col2Ref = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [visibleCols, setVisibleCols] = useState<number>(0); // 0,1,2 columns shown
  const [col1Mounted, setCol1Mounted] = useState(false);
  const [col2Mounted, setCol2Mounted] = useState(false);
  const [col1Active, setCol1Active] = useState(false);
  const [col2Active, setCol2Active] = useState(false);
  const [mainLockedWidth, setMainLockedWidth] = useState<number | null>(null);
  const col1Timer = useRef<number | null>(null);
  const col2Timer = useRef<number | null>(null);
  const prevVisibleCols = useRef<number | null>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  const MAIN_MAX = 600; // px
  const COL_TARGET = 300; // px (approx target column width)
  const GAP_PX = 16; // Tailwind gap-4 = 16px

  // Height sync logic
  const setColumnHeights = () => {
    const mainEl = mainRef.current;
    if (!mainEl) return;
    const height = Math.round(mainEl.getBoundingClientRect().height);
    if (col1Ref.current) col1Ref.current.style.height = `${height}px`;
    if (col2Ref.current) col2Ref.current.style.height = `${height}px`;
  };

  // Row width measurement - measure from leftmost to rightmost visible content
  const measureRowWidth = () => {
    if (onRowWidth && mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      let leftmostX = mainRect.left;
      let rightmostX = mainRect.right;

      // Find the rightmost visible column
      if (col2Active && col2Ref.current) {
        const col2Rect = col2Ref.current.getBoundingClientRect();
        rightmostX = col2Rect.right;
      } else if (col1Active && col1Ref.current) {
        const col1Rect = col1Ref.current.getBoundingClientRect();
        rightmostX = col1Rect.right;
      }

      // Calculate total content width including gaps and notify parent
      const totalContentWidth = Math.max(0, rightmostX - leftmostX);
      if (onRowWidth) onRowWidth(totalContentWidth);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ro: ResizeObserver | null = null;
    const update = () => {
      setColumnHeights();
      measureRowWidth();
      if (onMainImageLeft && mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        if (wrapperRect) {
          onMainImageLeft(rect.left - wrapperRect.left);
        }
      }
    };
    try {
      ro = new ResizeObserver(() => update());
      if (mainRef.current) ro.observe(mainRef.current);
    } catch (e) {}
    setTimeout(update, 50);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, [mainImg, visibleCols, onMainImageLeft, onRowWidth]);

  // Responsive column logic
  useEffect(() => {
    if (typeof window === "undefined") return;
    const decide = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return setVisibleCols(0);
      const available = Math.floor(wrapper.getBoundingClientRect().width);
      const need1 = MAIN_MAX + GAP_PX + COL_TARGET;
      const need2 = MAIN_MAX + GAP_PX + COL_TARGET + GAP_PX + COL_TARGET;
      if (available >= need2) setVisibleCols(2);
      else if (available >= need1) setVisibleCols(1);
      else setVisibleCols(0);
    };
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => decide());
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    } catch (e) {}
    decide();
    window.addEventListener("resize", decide);
    return () => {
      window.removeEventListener("resize", decide);
      if (ro) ro.disconnect();
    };
  }, [wrapperRef.current]);

  // Animation/mount flags
  useEffect(() => {
    const ANIM_MS = 300;
    // Lock main image width only when columns are being removed (to avoid
    // the main image shrinking then expanding when columns are being added).
    const prev = prevVisibleCols.current;
    const isRemovingCols =
      typeof prev === "number" ? visibleCols < prev : false;
    if (isRemovingCols && mainRef.current) {
      const w = Math.round(mainRef.current.getBoundingClientRect().width);
      setMainLockedWidth(w);
    }
    if (visibleCols >= 1) {
      if (!col1Mounted) setCol1Mounted(true);
      window.clearTimeout(col1Timer.current ?? 0);
      col1Timer.current = window.setTimeout(() => setCol1Active(true), 20);
    } else {
      setCol1Active(false);
      window.clearTimeout(col1Timer.current ?? 0);
      col1Timer.current = window.setTimeout(
        () => setCol1Mounted(false),
        ANIM_MS
      );
    }
    if (visibleCols >= 2) {
      if (!col2Mounted) setCol2Mounted(true);
      window.clearTimeout(col2Timer.current ?? 0);
      col2Timer.current = window.setTimeout(() => setCol2Active(true), 20);
    } else {
      setCol2Active(false);
      window.clearTimeout(col2Timer.current ?? 0);
      col2Timer.current = window.setTimeout(
        () => setCol2Mounted(false),
        ANIM_MS
      );
    }
    // After animations complete, ensure heights are synced and unlock main width
    const syncTimer = window.setTimeout(() => {
      setColumnHeights();
      setMainLockedWidth(null);
    }, ANIM_MS + 40);
    return () => {
      window.clearTimeout(col1Timer.current ?? 0);
      window.clearTimeout(col2Timer.current ?? 0);
      window.clearTimeout(syncTimer);
      setMainLockedWidth(null);
    };
  }, [visibleCols]);

  // Keep prevVisibleCols in sync
  useEffect(() => {
    prevVisibleCols.current = visibleCols;
  }, [visibleCols]);

  if (!mainImg) return null;
  // Helper to render alternating pattern
  const renderAlternatingGrid = () => {
    const rows = [];
    let i = 0;
    while (i < imgs.length) {
      // Large image row - capture the index before incrementing
      const largeImageIndex = i;
      if (largeImageIndex < imgs.length) {
        rows.push(
          <div
            key={`row-large-${largeImageIndex}`}
            className="w-full flex mb-2"
          >
            <div
              className="w-full aspect-[3/2] relative rounded-lg overflow-hidden cursor-zoom-in"
              onClick={() => setLightboxIdx(largeImageIndex)}
            >
              <Image
                src={imgs[largeImageIndex].url}
                alt={imgs[largeImageIndex].alt_text || "Listing image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          </div>
        );
        i++;
      }

      // Two half-width images row - capture indices before any operations
      if (i < imgs.length) {
        const firstHalfIndex = i;
        const secondHalfIndex = i + 1;
        rows.push(
          <div
            key={`row-half-${firstHalfIndex}`}
            className="w-full flex gap-2 mb-2"
          >
            {firstHalfIndex < imgs.length && (
              <div
                className="flex-1 aspect-[3/2] relative rounded-lg overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIdx(firstHalfIndex)}
              >
                <Image
                  src={imgs[firstHalfIndex].url}
                  alt={imgs[firstHalfIndex].alt_text || "Listing image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 340px"
                />
              </div>
            )}
            {secondHalfIndex < imgs.length && (
              <div
                className="flex-1 aspect-[3/2] relative rounded-lg overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIdx(secondHalfIndex)}
              >
                <Image
                  src={imgs[secondHalfIndex].url}
                  alt={imgs[secondHalfIndex].alt_text || "Listing image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 340px"
                />
              </div>
            )}
          </div>
        );
        i += 2;
      }
    }
    return <div className="py-6">{rows}</div>;
  };

  return (
    <>
      {/* Main gallery preview (click to open modal) */}
      <div
        ref={wrapperRef}
        className="w-full max-w-[1400px] mx-auto mb-8 px-6"
        style={{ overflowX: "hidden" }}
      >
        <div
          ref={rowRef}
          className="grid items-stretch justify-center"
          style={{
            // Keep three columns (main + two auto columns) and animate thumbnail widths
            gridTemplateColumns: `1fr auto auto`,
            gap: `${GAP_PX}px`,
            alignItems: "start",
            width: "100%",
          }}
        >
          {/* We'll switch to explicit grid columns below depending on visibleCols */}
          {/* Main image + text */}
          <div
            className="rounded-lg overflow-hidden cursor-zoom-in relative aspect-[3/2] min-h-0"
            ref={mainRef}
            onClick={() => setOpen(true)}
            style={
              mainLockedWidth
                ? {
                    width: `${mainLockedWidth}px`,
                    transition: "none",
                    willChange: "width",
                  }
                : { width: "100%" }
            }
          >
            <Image
              src={mainImg.url}
              alt={mainImg.alt_text || "Main image"}
              width={1200}
              height={800}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 68vw, 800px"
              priority
              onLoad={() => {
                setColumnHeights();
                setAnimationsEnabled(true);
              }}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: animationsEnabled ? undefined : "none",
              }}
            />
          </div>
          {/* Right columns */}
          {col1Mounted && (
            <div
              ref={col1Ref}
              className={clsx(
                "flex flex-col gap-4 min-w-0 h-full overflow-hidden",
                animationsEnabled
                  ? "transition-all duration-300 ease-out"
                  : "transition-none",
                col1Active
                  ? "w-[clamp(160px,18vw,300px)] opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-[6px]"
              )}
            >
              {thumbCols[0].map((img, i, arr) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden flex-1 min-h-0 cursor-zoom-in"
                  style={{
                    minHeight: 0,
                    height: `calc((100% - ${(arr.length - 1) * GAP_PX}px) / ${
                      arr.length
                    })`,
                    lineHeight: 0,
                  }}
                  onClick={() => setOpen(true)}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text || `Thumb ${i + 1}`}
                    width={300}
                    height={200}
                    sizes="(max-width: 640px) 50vw, 300px"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: animationsEnabled ? undefined : "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {col2Mounted && (
            <div
              ref={col2Ref}
              className={clsx(
                "flex flex-col gap-4 min-w-0 h-full overflow-hidden",
                animationsEnabled
                  ? "transition-all duration-300 ease-out"
                  : "transition-none",
                col2Active
                  ? "w-[clamp(160px,18vw,300px)] opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-[6px]"
              )}
            >
              {thumbCols[1].map((img, i, arr) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden flex-1 min-h-0 cursor-zoom-in"
                  style={{
                    minHeight: 0,
                    height: `calc((100% - ${(arr.length - 1) * GAP_PX}px) / ${
                      arr.length
                    })`,
                    lineHeight: 0,
                  }}
                  onClick={() => setOpen(true)}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text || `Thumb ${i + 3}`}
                    width={300}
                    height={200}
                    sizes="(max-width: 640px) 50vw, 300px"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: animationsEnabled ? undefined : "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Text block below entire gallery row */}
        {children && <div className="mt-6 text-left">{children}</div>}
      </div>

      {/* Modal sheet for alternating grid */}
      {open && (
        <ModalSheet
          onClose={() => setOpen(false)}
          enableEscape={lightboxIdx === null}
        >
          <div className="flex items-center h-14 px-4 border-b border-gray-200 relative">
            <div className="mx-auto font-semibold text-lg">{t("photos")}</div>
            <button
              className="text-2xl text-gray-700 hover:text-black absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
            >
              &times;
            </button>
            {/* Optionally add tabs for Floor plan, Street view, etc. */}
          </div>
          {/* Gallery content */}
          <div className="flex-1 overflow-y-auto w-full flex justify-center">
            <div className="w-full max-w-3xl mx-auto">
              {renderAlternatingGrid()}
            </div>
          </div>
        </ModalSheet>
      )}
      {lightboxIdx !== null && (
        <ListingGalleryLightbox
          images={imgs}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

// ModalSheet component for consistent modal logic and Escape key handling
function ModalSheet({
  children,
  onClose,
  enableEscape,
}: {
  children: React.ReactNode;
  onClose: () => void;
  enableEscape?: boolean;
}) {
  React.useEffect(() => {
    if (!enableEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, enableEscape]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full m-4 sm:m-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] bg-white flex flex-col overflow-hidden rounded-2xl 2xl:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
