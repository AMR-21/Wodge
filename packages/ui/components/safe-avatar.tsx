import { memo, useEffect, useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, updateAtom } from "..";
import { useAtomValue } from "jotai";

interface SafeAvatarProps {
  src?: string | null;
  fallback?: string | null;
  className?: string;
  fallbackClassName?: string;
  isBlob?: boolean;
}

export const SafeAvatar = memo(
  ({
    src,
    className,
    fallback,
    fallbackClassName,
    isBlob = false,
  }: SafeAvatarProps) => {
    const avatarRef = useRef<HTMLImageElement>(null);

    return (
      <>
        {src && (
          <Avatar
            className={cn(
              "h-12 w-12 rounded-full ring-[1.5px] ring-primary/30",
              className,
            )}
          >
            <AvatarImage ref={avatarRef} src={src} />
            <AvatarFallback className={fallbackClassName}>
              {fallback?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        {!src && (
          <Avatar
            className={cn("h-12 w-12 ring-[1.5px] ring-primary/30", className)}
          >
            <AvatarFallback className={fallbackClassName}>
              {fallback?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </>
    );
  },
);
