"use client";

import { Profile } from "@repo/data";
import { type CarouselApi } from "@repo/ui";
import React, { createContext, useRef } from "react";

interface ContextValues {
  profile: Partial<Profile>;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  avatarRef: React.RefObject<HTMLInputElement>;
  avatarFile: File | undefined;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}
const Context = createContext<ContextValues | null>(null);

export function OnboardingProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: Partial<Profile>;
}) {
  const [isPending, startTransition] = React.useTransition();
  const [avatar, setAvatar] = React.useState<string>(
    profile?.avatar || "/avatar.jpeg",
  );
  const [avatarFile, setAvatarFile] = React.useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  return (
    <Context.Provider
      value={{
        profile,
        isPending,
        startTransition,
        avatar,
        setAvatar,
        inputRef,
        avatarFile,
        setAvatarFile,
        avatarRef,
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
