"use client";

import { UserType } from "@repo/data/schemas";
import { useCacheUser } from "@repo/ui";
import { createContext, useContext, useTransition } from "react";

interface ContextValues {
  user: Partial<UserType>;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}

const Context = createContext<ContextValues | null>(null);

export function OnboardingProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Partial<UserType>;
}) {
  const [isPending, startTransition] = useTransition();

  useCacheUser();

  return (
    <Context.Provider
      value={{
        user,
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
