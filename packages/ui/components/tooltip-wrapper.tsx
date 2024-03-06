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

export const tol = React.forwardRef<HTMLDivElement, TooltipWrapperProps>(
  (
    {
      children,
      content = "",
      side = "bottom",
      sideOffset = 4,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <TooltipProvider {...props} delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div ref={ref}>{children}</div>
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
  },
);

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

        {content && (
          <TooltipContent
            side={side}
            sideOffset={sideOffset}
            className={className}
          >
            {content}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
