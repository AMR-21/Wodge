"use client";

import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import {
  Button,
  Step,
  Stepper,
  StepperContainer,
  cn,
  useStepper,
} from "@repo/ui";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-primary">
      A page
      <Stepper>
        <StepperContainer className="h-10 w-48 max-w-md bg-red-500">
          <Step index={1} className="bg-yellow-500">
            Welcome
          </Step>
          <Step index={2} className="bg-purple-600">
            bye
          </Step>
          <Step index={3} className="bg-purple-600">
            1
          </Step>
        </StepperContainer>

        <Btn />
        <Btn2 />
      </Stepper>
      {/* <Button>Click</Button>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button
      > */}
      {/* <div className="relative mx-0.5 flex h-20 w-48 items-center bg-slate-700">
        <Slide currentSlide={2} index={1} className="bg-yellow-500">
          1
        </Slide>
        <Slide className="z-20 bg-pink-700" currentSlide={2} index={2}>
          2
        </Slide>
        <Slide className="h-32 bg-purple-700" currentSlide={2} index={3}>
          3
        </Slide>
      </div> */}
    </main>
  );
}

function Btn() {
  const { nextStep } = useStepper();
  return <Button onClick={() => nextStep()}>next</Button>;
}

function Btn2() {
  const { prevStep } = useStepper();
  return <Button onClick={() => prevStep()}>prev</Button>;
}
function Slide({
  children,
  className,
  currentSlide,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  currentSlide: number;
  index: number;
}) {
  return (
    <div
      className={cn("absolute flex w-full transition-all", className)}
      style={{
        transform:
          currentSlide > index
            ? "translateX(-100%)"
            : currentSlide === index
              ? "translateX(0%)"
              : `translateX(${100}%)`,
      }}
    >
      {children}
    </div>
  );
}
