"use client";

import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";

export interface ListingGalleryLightboxProps {
  images: { url: string; alt_text?: string }[];
  initialIndex: number;
  onClose: () => void;
}

const ListingGalleryLightbox: React.FC<ListingGalleryLightboxProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const slides = images.map((img) => ({ src: img.url, alt: img.alt_text }));

  // helper to normalize index into [0, slides.length-1]
  const normalizeIndex = (idx: number) => {
    const n = slides.length || 1;
    // handle possible large/negative indices from carousel by modulo
    const mod = ((idx % n) + n) % n;
    return Math.max(0, Math.min(mod, n - 1));
  };

  // currentIndex should be clamped/normalized so we never show "14/12" etc.
  const [currentIndex, setCurrentIndex] = useState(() =>
    normalizeIndex(initialIndex)
  );

  // Reset currentIndex when initialIndex changes (when opening a new lightbox)
  React.useEffect(() => {
    setCurrentIndex(normalizeIndex(initialIndex));
  }, [initialIndex]);

  return (
    <>
      <Lightbox
        className="ya-lightbox--light"
        open={true}
        close={onClose}
        slides={slides}
        index={currentIndex}
        plugins={[Thumbnails, Fullscreen]}
        carousel={{ finite: false }}
        on={{
          view: ({ index }) => {
            // normalize index because the carousel may provide unbounded indices when looping
            setCurrentIndex(normalizeIndex(index));
          },
        }}
      />

      {/* Custom counter indicator */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "150px",
          transform: "translateX(-50%)",
          zIndex: 10000,
          background: "rgba(0, 0, 0, 0.7)",
          color: "#ffffff",
          borderRadius: "6px",
          padding: "6px 12px",
          fontSize: "14px",
          fontWeight: "500",
          userSelect: "none",
          textAlign: "center",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {currentIndex + 1} / {slides.length}
      </div>
      {/* Global overrides to make the lightbox use a light background and dark controls
          We scope by the `ya-lightbox--light` class so it only affects this instance. */}
      <style jsx global>{`
        .ya-lightbox--light .yarl__container,
        .ya-lightbox--light .yarl__overlay,
        .ya-lightbox--light .yarl__slide {
          background: rgba(255, 255, 255, 0.85) !important;
          color: #111 !important;
          transition: background 200ms ease;
        }
        .ya-lightbox--light .yarl__toolbar,
        .ya-lightbox--light .yarl__caption,
        .ya-lightbox--light .yarl__counter {
          color: #111 !important;
        }
        /* Make navigation arrows dark and slightly translucent */
        .ya-lightbox--light .yarl__arrow,
        .ya-lightbox--light .yarl__button {
          filter: none !important;
          color: #111 !important;
          opacity: 0.95;
        }
        /* Thumbnails area: target the plugin container and related elements so
           the default dark backdrop is replaced with a light rail */
        .ya-lightbox--light .yarl__thumbnails_container,
        .ya-lightbox--light .yarl__thumbnails_wrapper,
        .ya-lightbox--light .yarl__thumbnails,
        .ya-lightbox--light .yarl__thumbnails_track,
        .ya-lightbox--light .yarl__thumbnails__inner,
        .ya-lightbox--light .yarl__thumbnails__bar,
        .ya-lightbox--light .yarl__thumbnails__panel {
          background: rgba(255, 255, 255, 0.85) !important;
          /* also set the CSS var the plugin reads for background color */
          --yarl__thumbnails_container_background_color: rgba(
            255,
            255,
            255,
            0.85
          );
          --yarl__thumbnails_thumbnail_background: transparent;
          box-shadow: none !important;
          /* border-top removed for cleaner look */
          color: #111 !important;
        }

        /* Remove the dark vignette/gradient the plugin adds at the edges */
        .ya-lightbox--light .yarl__thumbnails_vignette {
          background: none !important;
          display: none !important;
        }

        /* Ensure thumbnail tiles render at full opacity and without filters */
        .ya-lightbox--light .yarl__thumbnails_thumbnail,
        .ya-lightbox--light .yarl__thumbnails_thumbnail *,
        .ya-lightbox--light .yarl__thumbnails .yarl__thumb,
        .ya-lightbox--light .yarl__thumbnails .yarl__thumb__img {
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          opacity: 1 !important;
        }

        /* Make the active thumbnail border more visible and blue in the light theme */
        .ya-lightbox--light .yarl__thumbnails_thumbnail_active {
          border-color: #2563eb !important; /* Tailwind blue-600 */
          border-width: 3px !important;
          box-shadow: 0 0 0 2px #2563eb33;
        }
        /* Broad override: any descendant with 'thumbnails' in the class name should be light */
        .ya-lightbox--light [class*="thumbnails"] {
          background: rgba(255, 255, 255, 0.85) !important;
          background-color: rgba(255, 255, 255, 0.85) !important;
          background-image: none !important;
          box-shadow: none !important;
          color: #111 !important;
        }
        .ya-lightbox--light [class*="thumbnails"]::before,
        .ya-lightbox--light [class*="thumbnails"]::after {
          background: transparent !important;
          content: none !important;
        }
        /* Also ensure the footer/controls area near thumbnails is light */
        .ya-lightbox--light .yarl__footer,
        .ya-lightbox--light .yarl__inner,
        .ya-lightbox--light .yarl__viewport {
          background: rgba(255, 255, 255, 0.85) !important;
        }
      `}</style>
    </>
  );
};

export default ListingGalleryLightbox;
