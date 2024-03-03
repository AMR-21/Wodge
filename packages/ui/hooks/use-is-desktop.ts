"use client";

import { useMediaQuery } from "usehooks-ts";

export function useIsDesktop() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop;
}
