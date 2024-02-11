"use client";

import { User } from "@repo/data";
import { createContext, useContext, useTransition } from "react";

interface ContextValues {
  user: Partial<User>;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}

const Context = createContext<ContextValues | null>(null);

export function OnboardingProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Partial<User>;
}) {
  const [isPending, startTransition] = useTransition();

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