"use client";

import {
  Button,
  Card,
  CardContent,
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  cn,
} from "@repo/ui";
import React, { useCallback } from "react";
import { Welcome } from "./welcome";
import { Profile } from "@/data/schemas/db.schema";
import { ProfileWrapper } from "./profile-wrapper";

export function StepsCarousal({ profile }: { profile?: Partial<Profile> }) {
  // const [_, api] = useEmblaCarousel();
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentSlide(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
    // setCount(api.scrollSnapList().length);
    // setCurrent(api.selectedScrollSnap() + 1);

    // api.on("select", () => {
    //   setCurrent(api.selectedScrollSnap() + 1);
    // });

    // console.log(api.previousScrollSnap(), api.canScrollPrev());
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        // active: false,
        // inViewThreshold: 0,
        watchDrag: false,
      }}
      className="w-full max-w-md space-y-8"
    >
      <CarouselContent className="">
        <CarouselItem className="flex max-h-fit items-center justify-center bg-red-500">
          <Welcome />
        </CarouselItem>
        <CarouselItem className="">
          <ProfileWrapper profile={profile} />
        </CarouselItem>
        {/* {[Welcome, ProfileForm, El].map((Element, index) => (
          <CarouselItem key={index} className="">
            <Element />
          </CarouselItem>
        ))} */}
      </CarouselContent>
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={() => api?.scrollNext()}
          className="w-[350px]"
          type="submit"
        >
          Continue
        </Button>

        <Button
          variant="outline"
          onClick={() => api?.scrollPrev()}
          className={cn("w-[350px]", currentSlide <= 1 && "invisible")}
        >
          Back
        </Button>
      </div>
    </Carousel>
  );
}

function El() {
  return <div>xxx</div>;
}
