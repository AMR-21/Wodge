import { getAvatarAddress } from "@repo/data";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { UseMutateFunction } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRef, useState } from "react";

interface AvatarCompProps {
  fallback?: string | null;
  id?: string;
  avatar?: string | null;
  className?: string;
  onUpload?: (file: File) => void;
  onRemove?: () => UseMutateFunction<boolean, Error, FormData, unknown>;
}

export function AvatarComp({
  fallback,
  className,
  avatar,
  onRemove,
  onUpload,
}: AvatarCompProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [blobUrl, setBlobUrl] = useState<string>("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // setFile(file);
      setBlobUrl(URL.createObjectURL(file));
      onUpload?.(file);
    }
  }

  return (
    <TooltipWrapper
      sideOffset={1}
      content={avatar ? "Replace avatar" : "Add avatar"}
    >
      <div
        className="group relative w-fit cursor-pointer"
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
        />
        <Avatar className={cn("h-12 w-12 rounded-md", className)}>
          {(blobUrl || avatar) && <AvatarImage src={blobUrl || avatar || ""} />}
          <AvatarFallback className="rounded-md text-lg uppercase transition-all  ">
            {fallback?.[0]}
          </AvatarFallback>
        </Avatar>
        {avatar && (
          <Button
            className="invisible absolute -right-1 -top-1 h-fit w-fit rounded-full p-0 transition-all duration-100 group-hover:visible"
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              setBlobUrl("");
              onRemove?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </TooltipWrapper>
  );
}
