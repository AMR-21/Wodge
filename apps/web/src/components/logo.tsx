import { Raleway } from "next/font/google";
import { cn } from "../../../../packages/ui";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  style: "italic",
});

export function Logo({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          raleway.className,
          "text-3xl font-bold text-primary",
          className,
        )}
      >
        wodge
      </span>
    </div>
  );
}
