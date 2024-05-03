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

    const updateFlag = useAtomValue(updateAtom);

    const url = useMemo(() => {
      if (src && !isBlob) {
        return src + "?" + new Date().getTime();
      }
      return src;
    }, [src, updateFlag, isBlob]);

    return (
      <>
        {url && (
          <Avatar className={cn("h-12 w-12 rounded-md", className)}>
            <AvatarImage ref={avatarRef} src={url} />
            <AvatarFallback className={fallbackClassName}>
              {fallback?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        {!url && (
          <Avatar className={cn("h-12 w-12 rounded-md", className)}>
            <AvatarFallback className={fallbackClassName}>
              {fallback?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </>
    );
  },
);
