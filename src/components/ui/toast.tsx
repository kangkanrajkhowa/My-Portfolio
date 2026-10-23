"use client";

import { useEffect, useState } from "react";

const EVENT = "kr-toast";

export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: message }));
}

type ToastItem = { id: number; message: string };

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (event: Event) => {
      const message = (event as CustomEvent<string>).detail;
      const id = ++counter;
      setItems((current) => [...current, { id, message }].slice(-3));
      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 2800);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="glass flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm shadow-lg"
        >
          <span className="size-1.5 rounded-full bg-lime" />
          {item.message}
        </div>
      ))}
    </div>
  );
}
