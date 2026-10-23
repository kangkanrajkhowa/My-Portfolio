"use client";

import { useEffect } from "react";

export function Hydrate() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return null;
}
