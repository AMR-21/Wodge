import { getAvatarAddress } from "@repo/data";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { UseMutateFunction } from "@tanstack/react-query";
import { clear } from "console";
import { set } from "lodash";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AvatarCompProps {
  fallback?: string | null;
  avatar?: string | null;
  className?: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
}

export function AvatarBtn({
  fallback,
  className,
  avatar,
  onRemove,
  onUpload,
  isUploading,
  isDeleting,
}: AvatarCompProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const [content, setContent] = useState<string | null>(null);

  const avatarRef = useRef<HTMLImageElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBlobUrl(URL.createObjectURL(file));
      onUpload?.(file);
    }
  }

  return (
    <TooltipWrapper
      sideOffset={1}
      content={content || (avatar ? "Replace avatar" : "Add avatar")}
    >
      <div
        className={cn(
          "group relative w-fit cursor-pointer",
          (isUploading || isDeleting) && "animate-pulse",
        )}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          ref={inputRef}
          className="absolute hidden"
          disabled={isUploading || isDeleting}
        />

        <SafeAvatar
          src={blobUrl || avatar}
          isBlob={!!blobUrl}
          className={cn("h-12 w-12 rounded-md", className)}
          fallbackClassName="rounded-md text-lg uppercase transition-all"
          fallback={fallback}
        />

        {avatar && (
          <Button
            className="invisible absolute -right-1 -top-1 h-fit w-fit rounded-full p-0 transition-all duration-100 group-hover:visible"
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              setBlobUrl(undefined);
              onRemove?.();
            }}
            disabled={isDeleting}
            onMouseEnter={() => {
              setContent("Remove avatar");
            }}
            onMouseLeave={() => {
              setContent(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </TooltipWrapper>
  );
}
