import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/ui/carousel";
import { RecentItem } from "./recent-item";
import { useRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";

export function RecentCarousel() {
  const recent = useRecentlyVisited();

  return (
    <div className="group flex w-full flex-col items-center gap-2 rounded-md border border-border bg-dim px-2 py-2">
      <p className="self-start text-sm text-muted-foreground">
        Recently visited
      </p>

      {!recent?.length && (
        <p className="text-sm text-muted-foreground">No recent items</p>
      )}

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {recent?.map((r, index) => (
            <CarouselItem key={index} className="w-36 max-w-36 pl-2">
              <RecentItem item={r} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="secondary"
          className="invisible -left-6 transition-all disabled:hidden group-hover:visible"
        />
        <CarouselNext
          className="invisible -right-6 transition-all hover:visible disabled:hidden group-hover:visible"
          variant="secondary"
        />
      </Carousel>
    </div>
  );
}
