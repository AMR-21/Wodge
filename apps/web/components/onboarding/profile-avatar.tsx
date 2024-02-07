import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  buttonVariants,
  cn,
} from "@repo/ui";

import { LuX } from "react-icons/lu";
import { useOnboarding } from "./onboarding-context";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadAvatar } from "@/lib/client-utils";
interface ProfileAvatarProps {
  fallback: string;
  className?: string;
}

// TODO: Allow user to upload their own avatar here
export function ProfileAvatar({
  fallback = "",
  className,
}: ProfileAvatarProps) {
  const { avatar, setAvatar } = useOnboarding();
  const [isHovered, setIsHovered] = useState(false);
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isDefault = avatar === "/avatar.jpeg";

  useEffect(() => {
    if (file) {
      uploadAvatar(file);

      const url = URL.createObjectURL(file);

      console.log(url);
      setAvatar(url);
    }
  }, [file]);

  return (
    <div className="flex justify-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="group relative flex w-fit"
              onClick={() => inputRef.current?.click()}
            >
              <Input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={(e) =>
                  setFile((cur) =>
                    e.target.files && e.target.files.length > 0
                      ? e.target.files[0]
                      : cur,
                  )
                }
              />

              <Avatar
                className={cn(
                  "peer h-20 w-20  ring-2 ring-border ring-offset-2 ring-offset-background",
                  className,
                )}
              >
                <AvatarImage src={avatar} alt={``} />
                <AvatarFallback>
                  {fallback.length >= 2
                    ? fallback.slice(0, 2).toUpperCase()
                    : fallback.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {!isDefault && (
                <div
                  role="button"
                  className={cn(
                    buttonVariants({ size: "fit", variant: "neutral" }),
                    "invisible absolute -right-1 top-0 rounded-full border border-border transition-all group-hover:visible",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatar("/avatar.jpeg");
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
              {isHovered && !isDefault
                ? "Remove avatar"
                : isDefault
                  ? "Add avatar"
                  : "Change avatar"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
