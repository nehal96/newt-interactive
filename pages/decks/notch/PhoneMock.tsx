import { useEffect, useRef } from "react";
import { useInViewport, useMediaQuery } from "@hooks";

interface PhoneMockProps {
  /** Under /public; a video or a still. */
  src: string;
  poster?: string;
  /** The media's accessible label. */
  label: string;
}

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

export default function PhoneMock({ src, poster, label }: PhoneMockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { hasBeenNear, isActive } = useInViewport(videoRef, {
    activeMargin: "300px",
  });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Playback is driven after the render that attaches `src`; playing straight
  // from the observer would fire against a source-less element.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasBeenNear) return;

    if (isActive && !reduced) el.play().catch(() => {});
    else el.pause();
  }, [hasBeenNear, isActive, reduced]);

  return (
    <div className="phone">
      <div className="phone-screen">
        {isVideo(src) ? (
          <video
            ref={videoRef}
            src={hasBeenNear ? src : undefined}
            poster={hasBeenNear ? poster : undefined}
            preload="none"
            muted
            loop
            playsInline
            aria-label={label}
          />
        ) : (
          <img src={src} alt={label} loading="lazy" decoding="async" />
        )}
      </div>
    </div>
  );
}
