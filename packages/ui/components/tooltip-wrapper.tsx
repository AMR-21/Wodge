import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactNode;
  content?: string | React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
}

export function TooltipWrapper({
  children,
  content = "",
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: TooltipWrapperProps) {
  return (
    <TooltipProvider {...props} delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{children}</div>
        </TooltipTrigger>

        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          className={className}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
