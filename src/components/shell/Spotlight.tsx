"use client";

import { useEffect, useRef } from "react";

/**
 * Soft lime glow that follows the pointer. It is a translated element rather
 * than a full-screen gradient repainted per event, so following the cursor
 * costs a compositor move instead of a viewport repaint.
 */
export function Spotlight() {
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const glow = glowRef.current;
    if (!glow) return;

    let frame = 0;
    let queued = false;
    let x = 0;
    let y = 0;
    let placed = false;

    const apply = () => {
      queued = false;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!placed) {
        placed = true;
        glow.style.opacity = "1";
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="spotlight" aria-hidden="true">
      <span ref={glowRef} className="spotlight-glow" />
    </div>
  );
}
