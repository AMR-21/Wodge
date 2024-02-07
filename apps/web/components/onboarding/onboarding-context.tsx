"use client";

import { Profile } from "@repo/data";
import { type CarouselApi } from "@repo/ui";
import React, { createContext } from "react";

interface ContextValues {
  api: CarouselApi;
  setApi: React.Dispatch<React.SetStateAction<CarouselApi | undefined>>;
  profile: Partial<Profile>;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
}
const Context = createContext<ContextValues | null>(null);

export function OnboardingProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: Partial<Profile>;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPending, startTransition] = React.useTransition();
  const [avatar, setAvatar] = React.useState<string>(profile?.avatar || "");

  return (
    <Context.Provider
      value={{
        api,
        setApi,
        profile,
        isPending,
        startTransition,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useOnboarding() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
