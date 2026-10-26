"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/site";

type LottieProps = {
  /** Public path of the animation, e.g. "/lottie/orbit.json". */
  src: string;
  className?: string;
  /** Accessible name. Omit for purely decorative artwork. */
  label?: string;
};

export function Lottie({ src, className, label }: LottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animation: import("lottie-web").AnimationItem | undefined;
    let cancelled = false;

    const load = async () => {
      // The light SVG player is small and only pulled in when the graphic
      // actually scrolls into view.
      const { default: lottie } = await import(
        "lottie-web/build/player/lottie_light"
      );
      if (cancelled) return;

      animation = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: !reduced,
        autoplay: !reduced,
        path: asset(src),
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });

      if (reduced) {
        animation.addEventListener("DOMLoaded", () => {
          animation?.goToAndStop(
            Math.floor(animation.totalFrames / 2),
            true,
          );
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void load();
      },
      { rootMargin: "250px" },
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      animation?.destroy();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    />
  );
}