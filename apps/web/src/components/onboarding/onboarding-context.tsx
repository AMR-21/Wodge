"use client";

import { Profile } from "@repo/data";
import { createContext, useContext, useTransition } from "react";

interface ContextValues {
  profile: Partial<Profile>;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}

const Context = createContext<ContextValues | null>(null);

export function OnboardingProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: Partial<Profile>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Context.Provider
      value={{
        profile,
        isPending,
        startTransition,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
