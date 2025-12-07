"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export interface ListingGalleryProps {
  images?: string[];
  youtubeUrl?: string;
  kuulaUrl?: string;
  onMainImageLeft?: (leftPosition: number) => void;
  children?: React.ReactNode;
  onRowWidth?: (width: number) => void;
}

export default function ListingGallery({
  images,
  youtubeUrl,
  kuulaUrl,
  onMainImageLeft,
  children,
  onRowWidth,
}: ListingGalleryProps) {
  const t = useTranslations("ListingDetail");
  const [open, setOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<"photos" | "video" | "tour">(
    "photos"
  );
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

  // Helper to extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
      if (
        urlObj.hostname.includes("youtube.com") &&
        urlObj.searchParams.has("v")
      ) {
        return urlObj.searchParams.get("v");
      }
    } catch (e) {
      // If URL parsing fails, return null
    }
    return null;
  };

  // Helper to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Helper to get video info from our API
  const getVideoInfo = async (
    url: string
  ): Promise<{
    aspectRatio: number;
    embedUrl: string;
    title: string;
  } | null> => {
    try {
      const response = await fetch(
        `/api/youtube-info?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return {
        aspectRatio: data.aspectRatio,
        embedUrl: data.embedUrl,
        title: data.title,
      };
    } catch (error) {
      console.warn("Failed to fetch video info:", error);
      return null;
    }
  };

  // Convert Kuula URL to embed URL
  const getKuulaEmbedUrl = (url: string): string | null => {
    try {
      console.log("Processing Kuula URL:", url);
      
      // Handle various Kuula URL formats including custom domains:
      // Standard: kuula.co/share/TOUR_ID, kuula.co/tinyplanet/TOUR_ID, kuula.co/post/TOUR_ID
      // Custom domains: *.viewin360.co/share/collection/TOUR_ID or similar patterns
      const patterns = [
        // Standard kuula.co patterns
        /(?:https?:\/\/)?(?:www\.)?kuula\.co\/(?:share|tinyplanet|post)\/([^/?#]+)/,
        
        // Custom domain patterns (like viewin360.co)
        /(?:https?:\/\/)?([^\/]+\.viewin360\.co)\/share\/collection\/([^/?#]+)/,
        /(?:https?:\/\/)?([^\/]+\.viewin360\.co)\/share\/([^/?#]+)/,
        
        // Generic custom domain patterns for Kuula-powered sites
        /(?:https?:\/\/)?([^\/]+)\/share\/collection\/([^/?#]+)/,
        
        // Direct kuula.co links
        /(?:https?:\/\/)?(?:www\.)?kuula\.co\/([^/?#]+)$/
      ];
      
      let tourId = null;
      let customDomain = null;
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          console.log("Matched pattern:", pattern.toString());
          
          if (pattern.source.includes('viewin360') || pattern.source.includes('collection')) {
            // Custom domain match - extract both domain and tour ID
            customDomain = match[1];
            tourId = match[2];
            console.log("Custom domain:", customDomain, "Tour ID:", tourId);
          } else {
            // Standard kuula.co match
            tourId = match[1];
            console.log("Standard kuula.co Tour ID:", tourId);
          }
          break;
        }
      }
      
      if (tourId && tourId.length > 3) {
        let embedUrl;
        
        if (customDomain) {
          // For custom domains, try to use the same domain for embedding
          embedUrl = `https://${customDomain}/share/collection/${tourId}?embed=1&thumbs=1&nav=1&scene_list=1&ui=1`;
        } else {
          // Standard kuula.co embedding
          embedUrl = `https://kuula.co/share/${tourId}?embed=1&thumbs=1&nav=1&scene_list=1&ui=1`;
        }
        
        console.log("Generated embed URL:", embedUrl);
        return embedUrl;
      } else {
        console.warn("Kuula URL doesn't match expected patterns or invalid tour ID:", url);
        console.warn("Extracted tour ID:", tourId);
        console.warn("Custom domain:", customDomain);
      }
    } catch (e) {
      console.error("Invalid Kuula URL:", e);
    }
    return null;
  };

  const hasVideo = !!youtubeUrl;
  const hasKuula = !!kuulaUrl;
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [kuulaEmbedUrl, setKuulaEmbedUrl] = useState<string | null>(null);
  const [modalDimensions, setModalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Store original overflow style
      const originalOverflow = document.body.style.overflow;

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      return () => {
        // Restore original overflow when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Measure modal dimensions
  useEffect(() => {
    const measureModal = () => {
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        setModalDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    if (open) {
      // Measure after modal is rendered
      setTimeout(measureModal, 100);

      // Re-measure on window resize
      const handleResize = () => measureModal();
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [open]);

  // Fetch video info when URL changes
  useEffect(() => {
    if (youtubeUrl && hasVideo) {
      getVideoInfo(youtubeUrl).then((info) => {
        if (info) {
          setVideoAspectRatio(info.aspectRatio);
          setVideoEmbedUrl(info.embedUrl);
          setVideoTitle(info.title);
        } else {
          setVideoAspectRatio(null);
          setVideoEmbedUrl(null);
          setVideoTitle(null);
        }
      });
    } else {
      setVideoAspectRatio(null);
      setVideoEmbedUrl(null);
      setVideoTitle(null);
    }
  }, [youtubeUrl, hasVideo]);

  // Setup Kuula embed URL when URL changes
  useEffect(() => {
    if (kuulaUrl && hasKuula) {
      const embedUrl = getKuulaEmbedUrl(kuulaUrl);
      setKuulaEmbedUrl(embedUrl);
    } else {
      setKuulaEmbedUrl(null);
    }
  }, [kuulaUrl, hasKuula]);

  // Calculate video dimensions with 10% gaps (more space for video)
  const calculateVideoSize = () => {
    if (!modalDimensions || !videoAspectRatio) return null;

    // Available space with 10% gaps (so 80% of modal dimensions)
    const availableWidth = modalDimensions.width * 0.8; // 10% gap on each side
    const availableHeight = (modalDimensions.height - 120) * 0.8; // 10% gap + space for tabs/controls

    // Calculate dimensions that fit within available space while maintaining aspect ratio
    const widthBasedHeight = availableWidth / videoAspectRatio;
    const heightBasedWidth = availableHeight * videoAspectRatio;

    if (widthBasedHeight <= availableHeight) {
      // Width is the limiting factor
      return {
        width: availableWidth,
        height: widthBasedHeight,
      };
    } else {
      // Height is the limiting factor
      return {
        width: heightBasedWidth,
        height: availableHeight,
      };
    }
  };

  const videoSize = calculateVideoSize();

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
              className="w-full aspect-[3/2] relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(largeImageIndex)}
            >
              <Image
                src={imgs[largeImageIndex]}
                alt="Listing image"
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
                className="flex-1 aspect-[3/2] relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(firstHalfIndex)}
              >
                <Image
                  src={imgs[firstHalfIndex]}
                  alt="Listing image"
                  fill
                  className="object-cover"
                  sizes="350px"
                />
              </div>
            )}
            {secondHalfIndex < imgs.length && (
              <div
                className="flex-1 aspect-[3/2] relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(secondHalfIndex)}
              >
                <Image
                  src={imgs[secondHalfIndex]}
                  alt="Listing image"
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
            className="rounded-lg overflow-hidden cursor-pointer relative aspect-[3/2] min-h-0"
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
              src={mainImg}
              alt="Main image"
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
                  className="rounded-lg overflow-hidden flex-1 min-h-0 cursor-pointer"
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
                    src={img}
                    alt={`Thumb ${i + 1}`}
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
                  className="rounded-lg overflow-hidden flex-1 min-h-0 cursor-pointer"
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
                    src={img}
                    alt={`Thumb ${i + 3}`}
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
          modalRef={modalRef}
        >
          <div className="flex items-center h-14 px-4 border-b border-gray-200 relative">
            {/* Tab navigation in modal using ShadCN Tabs */}
            <Tabs
              value={modalTab}
              onValueChange={(value) =>
                setModalTab(value as "photos" | "video" | "tour")
              }
              className="flex-1"
            >
              <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start">
                <TabsTrigger
                  value="photos"
                  className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-600 border-transparent text-gray-500 hover:text-gray-700 rounded-none"
                >
                  {t("gallery")}
                </TabsTrigger>
                {hasVideo && (
                  <TabsTrigger
                    value="video"
                    className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-600 border-transparent text-gray-500 hover:text-gray-700 rounded-none"
                  >
                    {t("video")}
                  </TabsTrigger>
                )}
                {hasKuula && (
                  <TabsTrigger
                    value="tour"
                    className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-600 border-transparent text-gray-500 hover:text-gray-700 rounded-none"
                  >
                    {t("virtualTour")}
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            <button
              className="text-2xl text-gray-700 hover:text-black absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
            >
              &times;
            </button>
          </div>

          {/* Tab content using conditional rendering since TabsContent needs to be in same Tabs wrapper as TabsList */}
          <div className="flex-1 overflow-hidden">
            {modalTab === "photos" && (
              <div className="flex-1 overflow-y-auto w-full h-full flex justify-center">
                <div className="w-full max-w-3xl mx-auto">
                  {renderAlternatingGrid()}
                </div>
              </div>
            )}

            {modalTab === "video" && (
              <div className="flex-1 overflow-hidden w-full h-full flex justify-center items-center">
                {hasVideo && youtubeUrl ? (
                  <>
                    {videoEmbedUrl && videoSize ? (
                      <div
                        className="rounded-lg overflow-hidden shadow-lg"
                        style={{
                          width: `${videoSize.width}px`,
                          height: `${videoSize.height}px`,
                        }}
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          src={videoEmbedUrl}
                          title={videoTitle || "YouTube video player"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : videoEmbedUrl ? (
                      <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-md aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={videoEmbedUrl}
                          title={videoTitle || "YouTube video player"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        Loading video...
                      </div>
                    )}
                  </>
                ) : (
                  // Empty state placeholder for video
                  <div className="flex flex-col items-center justify-center w-full max-w-md aspect-video mx-auto">
                    <div className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center">
                      {/* Video camera icon with slash */}
                      <div className="relative">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                        {/* Diagonal slash */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-0.5 bg-red-400 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 text-center">
                      No video available
                    </p>
                  </div>
                )}
              </div>
            )}

            {modalTab === "tour" && (
              <div className="flex-1 overflow-hidden w-full h-full flex justify-center items-center">
                {hasKuula && kuulaUrl ? (
                  <>
                    {kuulaEmbedUrl && videoSize ? (
                      <div
                        className="rounded-lg overflow-hidden shadow-lg"
                        style={{
                          width: `${videoSize.width}px`,
                          height: `${videoSize.height}px`,
                        }}
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          src={kuulaEmbedUrl}
                          title="Virtual Tour"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    ) : kuulaEmbedUrl ? (
                      <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-md aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={kuulaEmbedUrl}
                          title="Virtual Tour"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        Loading virtual tour...
                      </div>
                    )}
                  </>
                ) : (
                  // Empty state placeholder for virtual tour
                  <div className="flex flex-col items-center justify-center w-full max-w-md aspect-video mx-auto">
                    <div className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center">
                      {/* VR/360 icon with slash */}
                      <div className="relative">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>
                        {/* Diagonal slash */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-0.5 bg-red-400 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 text-center">
                      No virtual tour available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ModalSheet>
      )}
      {lightboxIdx !== null && (
        <ListingGalleryLightbox
          images={imgs.map((url) => ({ url, alt_text: "" }))}
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
  modalRef,
}: {
  children: React.ReactNode;
  onClose: () => void;
  enableEscape?: boolean;
  modalRef?: React.RefObject<HTMLDivElement | null>;
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
        ref={modalRef}
        className="relative w-full h-full m-4 sm:m-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] bg-white flex flex-col overflow-hidden rounded-2xl 2xl:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
