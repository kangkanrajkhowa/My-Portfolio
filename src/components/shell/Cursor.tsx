"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    document.body.dataset.customCursor = "true";

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;
    let visible = false;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]",
      );

      if (interactive) {
        const label = interactive.dataset.cursorLabel;
        ring.dataset.active = "true";
        if (label) {
          ring.dataset.label = "true";
          ring.textContent = label;
        } else {
          ring.dataset.label = "false";
          ring.textContent = "";
        }
      } else {
        ring.dataset.active = "false";
        ring.dataset.label = "false";
        ring.textContent = "";
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      delete document.body.dataset.customCursor;
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot opacity-0"
        aria-hidden="true"
        data-testid="cursor-dot"
      />
      <div ref={ringRef} className="cursor-ring opacity-0" aria-hidden="true" />
    </>
  );
}
