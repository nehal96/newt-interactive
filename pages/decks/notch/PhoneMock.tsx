import { useEffect, useRef, useState } from "react";

export interface PhoneMockProps {
  /** Under /public. Omitted while a slot is still awaiting its capture. */
  src?: string;
  poster?: string;
  /** Placeholder caption, and the video's accessible label. */
  label: string;
  variant?: "volt" | "open";
}

/* Ten of these share one page, so nothing is fetched until it is nearly on
   screen and playback stops again once it leaves. */
export default function PhoneMock({
  src,
  poster,
  label,
  variant = "volt",
}: PhoneMockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  // Playback is driven after the render that attaches `src`; calling play()
  // straight from the observer would fire against a source-less element.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !armed) return;

    if (visible && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [armed, visible]);

  return (
    <div className={`phone${variant === "open" ? " open-phone" : ""}`}>
      {!src && <div className="island" />}
      <div className="phone-screen">
        {src ? (
          <video
            ref={videoRef}
            src={armed ? src : undefined}
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            aria-label={label}
          />
        ) : (
          <div className="awaiting">
            <div className="aw-name">{label}</div>
            <div className="aw-hint">Media slot</div>
          </div>
        )}
      </div>
    </div>
  );
}
