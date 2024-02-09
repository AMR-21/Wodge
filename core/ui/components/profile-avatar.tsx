"use client";

import * as React from "react";
import { LuX } from "react-icons/lu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";

interface ProfileAvatarProps {
  avatar?: string;
  fallback?: string;
  localUrl?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  onRemoveAvatar?: () => void;
  className?: string;
}

export function ProfileAvatar({
  avatar,
  fallback = "",
  localUrl,
  inputRef,
  onRemoveAvatar,
  className,
}: ProfileAvatarProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClearHovered, setIsClearHovered] = React.useState(false);

  const hasAvatar = !!localUrl || !!avatar;

  return (
    <div className="flex justify-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip open={isHovered}>
          <TooltipTrigger>
            <div
              className="group relative flex w-fit"
              onClick={() => inputRef?.current?.click()}
              onMouseLeave={() => setIsHovered(false)}
              onMouseEnter={() => setIsHovered(true)}
            >
              <Avatar
                className={cn(
                  "peer h-20 w-20  ring-2 ring-border ring-offset-2 ring-offset-background",
                  className,
                )}
              >
                <AvatarImage
                  src={localUrl || avatar}
                  alt={`${fallback}'s avatar`}
                />
                <AvatarFallback>
                  {fallback.length >= 2
                    ? fallback.slice(0, 2).toUpperCase()
                    : fallback.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {hasAvatar && (
                <div
                  role="button"
                  className={cn(
                    buttonVariants({ size: "fit", variant: "neutral" }),
                    "invisible absolute -right-1 top-0 rounded-full border border-border transition-all group-hover:visible",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAvatar?.();
                  }}
                  onMouseEnter={() => {
                    setIsClearHovered(true);
                    setIsHovered(true);
                  }}
                  onMouseLeave={() => setIsClearHovered(false)}
                >
                  <LuX />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6} className="px-2 py-1">
            <p>
              {hasAvatar
                ? isClearHovered
                  ? "Remove avatar"
                  : "Change avatar"
                : "Add avatar"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
