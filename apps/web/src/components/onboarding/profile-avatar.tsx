import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  buttonVariants,
  cn,
} from "@repo/ui";

import { LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
interface ProfileAvatarProps {
  avatar?: string;
  avatarFile?: File;
  setAvatar?: React.Dispatch<React.SetStateAction<string>>;
  setAvatarFile?: React.Dispatch<React.SetStateAction<File | undefined>>;
  inputRef?: React.RefObject<HTMLInputElement>;
  // avatarRef?: React.RefObject<HTMLImageElement>;
  fallback?: string;
  className?: string;
}

export function ProfileAvatar({
  avatar,
  avatarFile,
  setAvatar,
  setAvatarFile,
  inputRef,
  fallback = "",
  className,
}: ProfileAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [url, setUrl] = useState<string>("");

  const hasFile = !!avatarFile || avatar !== "/avatar.jpeg";

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setUrl(url);
      if (avatar !== "/avatar.jpeg") setAvatar?.("/avatar.jpeg");
      return;
    }
    setUrl("");
  }, [avatarFile]);

  return (
    <div className="flex justify-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="group relative flex w-fit"
              onClick={() => inputRef?.current?.click()}
              onMouseLeave={(e) => e.currentTarget.blur()}
            >
              <Avatar
                className={cn(
                  "peer h-20 w-20  ring-2 ring-border ring-offset-2 ring-offset-background",
                  className,
                )}
              >
                <AvatarImage src={url || avatar} alt={``} />
                <AvatarFallback>
                  {fallback.length >= 2
                    ? fallback.slice(0, 2).toUpperCase()
                    : fallback.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {hasFile && (
                <div
                  role="button"
                  className={cn(
                    buttonVariants({ size: "fit", variant: "neutral" }),
                    "invisible absolute -right-1 top-0 rounded-full border border-border transition-all group-hover:visible",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();

                    setAvatarFile?.(undefined);
                    setAvatar?.("");
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <LuX />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6} className="px-2 py-1">
            <p>
              {isHovered && hasFile
                ? "Remove avatar"
                : hasFile
                  ? "Change avatar"
                  : "Add avatar"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
