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
  Loader,
} from "@repo/ui";
import React, { createContext, useCallback, useRef } from "react";
import { Welcome } from "./welcome";
import { Profile } from "@repo/data";
import { ProfileWrapper } from "./profile-wrapper";
import { useOnboarding } from "./onboarding-context";

export function OnboardingSteps() {
  const [currentSlide, setCurrentSlide] = React.useState(1);
  const { api, setApi, isPending } = useOnboarding();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        watchDrag: false,
      }}
      className="w-full max-w-md space-y-8"
    >
      <CarouselContent className="">
        {[Welcome, ProfileWrapper, El, El].map((Component, index) => (
          <CarouselItem key={index}>
            <Component />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={(e) => {
            // if slide is not the form prevent submission
            if (currentSlide !== 2) {
              e.preventDefault();
            }

            // if the slide is the form delegate scroll to the form
            if (currentSlide === 2) {
              return;
            }
            api?.scrollNext();
          }}
          className="w-[350px]"
          type="submit"
          form="profile-form"
          disabled={isPending}
        >
          {isPending ? (
            <Loader color="rgb(var(--primary-foreground))" />
          ) : (
            "Continue"
          )}
        </Button>

        <Button onClick={() => api?.scrollPrev()}>back</Button>
        <Button onClick={() => api?.scrollNext()}>next</Button>
      </div>
    </Carousel>
  );
}

function El() {
  return <div>xxx</div>;
}
