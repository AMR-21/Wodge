import * as React from "react";

import { cn } from "../../lib/utils";
import { Label } from "./label";
import { FormControl } from "./form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "peer flex h-10 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-muted-foreground placeholder:text-muted-foreground focus-visible:border-primary  focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            label && "h-12 pt-[1.45rem] text-sm",
            props["aria-invalid"] &&
              "border-destructive focus-visible:border-destructive",

            className,
          )}
          ref={ref}
          {...props}
        />

        {label && (
          <Label
            htmlFor={props.id}
            className={cn(
              " absolute left-3 top-1/2 translate-y-[-50%] capitalize  transition-all peer-focus:top-3 peer-focus:pt-1.5 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-primary-base",
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
  },
);
Input.displayName = "Input";

export { Input };
