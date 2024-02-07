"use client";

import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  Loader,
} from "@repo/ui";
import React from "react";
import { Outro, Welcome } from "./screening";
import { ProfileWrapper } from "./profile-wrapper";
import { useOnboarding } from "./onboarding-context";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/routes";

export function OnboardingSteps() {
  const [currentSlide, setCurrentSlide] = React.useState(1);
  const { api, setApi, isPending } = useOnboarding();
  const isLastSlide = currentSlide === api?.scrollSnapList().length;

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
        watchDrag: false,
        skipSnaps: true,
      }}
      className="w-full max-w-md space-y-8"
    >
      <CarouselContent className="">
        {[Welcome, ProfileWrapper, El, Outro].map((Component, index) => (
          <CarouselItem key={index}>
            <Component />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex flex-col items-center gap-2">
        <Button
          {...(!isLastSlide && {
            onClick: (e) => {
              // if slide is not the form prevent submission
              if (currentSlide !== 2) {
                e.preventDefault();
              }

              // if the slide is the form delegate scroll to the form
              if (currentSlide === 2) {
                return;
              }

              api?.scrollNext();
            },
          })}
          className="w-[350px]"
          type="submit"
          form="profile-form"
          disabled={isPending}
          asChild={isLastSlide}
        >
          {isLastSlide ? (
            <Link href={DEFAULT_LOGIN_REDIRECT}>Get started</Link>
          ) : isPending ? (
            <Loader color="rgb(var(--primary-foreground))" />
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </Carousel>
  );
}

function El() {
  return <div className="text-center">choose light/dark + features</div>;
}
