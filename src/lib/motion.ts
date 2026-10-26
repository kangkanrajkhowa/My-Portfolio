import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToSection(target: string) {
  const element = document.querySelector(target);
  if (!element) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(element as HTMLElement, { offset: -80, duration: 1.1 });
    return;
  }
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
