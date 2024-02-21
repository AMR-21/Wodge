import * as React from "react";

import { cn } from "../../lib/utils";
import { Label } from "./label";
import { cva } from "class-variance-authority";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        withLabel: "peer h-12 pt-[1.45rem] text-sm ",
      },
    },
  },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    if (label) {
      return (
        <div className="relative">
          <input
            type={type}
            className={cn(
              inputVariants({ variant: "withLabel" }),
              props["aria-invalid"] &&
                "border-destructive focus-visible:ring-destructive",
              className,
            )}
            ref={ref}
            {...props}
          />

          {label && (
            <Label
              htmlFor={props.id}
              className={cn(
                "absolute left-3 top-1/2 translate-y-[-50%] capitalize  transition-all peer-focus:top-3 peer-focus:pt-1.5 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-primary-base",
                props.value && "top-3 pt-1.5 text-xs text-foreground/80 ",
                props["aria-invalid"] &&
                  "text-destructive peer-focus:text-destructive dark:text-destructive-base dark:peer-focus:text-destructive-base",
              )}
            >
              {label}
            </Label>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          inputVariants(),
          props["aria-invalid"] &&
            "border-destructive focus-visible:ring-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
