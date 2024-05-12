import { forwardRef, memo, useEffect, useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface SafeAvatarProps {
  src?: string | null;
  fallback?: string | null;
  className?: string;
  fallbackClassName?: string;
  isBlob?: boolean;
  color?: string;
}

export const SafeAvatar = forwardRef<HTMLDivElement, SafeAvatarProps>(
  (
    {
      src,
      className,
      fallback,
      fallbackClassName,
      isBlob = false,
      color,
    }: SafeAvatarProps,
    ref,
  ) => {
    return (
      <>
        {src && (
          <Avatar
            ref={ref}
            className={cn(
              "h-12 w-12 rounded-full ",
              !color && "ring-[1.5px] ring-primary/30",
              color && "border-2",
              className,
            )}
            {...(color && { style: { borderColor: color } })}
          >
            <AvatarImage src={src} />
            <AvatarFallback className={fallbackClassName}>
              {fallback?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        {!src && (
          <Avatar
            ref={ref}
            className={cn(
              "h-12 w-12 rounded-full ",
              !color && "ring-[1.5px] ring-primary/30",
              color && "border-2",
              className,
            )}
            {...(color && { style: { borderColor: color } })}
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
