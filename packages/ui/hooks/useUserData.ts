"use client";

import { PublicUserType } from "@repo/data";

export function useUserData() {
  if (typeof window === "undefined") {
    return JSON.parse(localStorage.getItem("user")!) as PublicUserType;
  }
}
