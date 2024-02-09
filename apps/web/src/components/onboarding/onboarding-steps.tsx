"use client";

import { Loader, NextBtn, Step, Stepper, StepperContainer } from "@repo/ui";
import { Outro, Welcome } from "./screening";
import { ProfileWrapper } from "./profile-wrapper";
import { useOnboarding } from "./onboarding-context";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/routes";

export function OnboardingSteps() {
  const { isPending } = useOnboarding();

  return (
    <Stepper className="max-w-lg">
      <StepperContainer>
        <Step index={1}>
          <Welcome />
          <NextBtn className="w-4/6">Continue</NextBtn>
        </Step>
        <Step index={2}>
          <ProfileWrapper />
          <NextBtn
            className="w-4/6"
            onClick={() => {}}
            type="submit"
            form="profile-form"
            disabled={isPending}
          >
            {isPending ? (
              <Loader color="rgb(var(--primary-foreground))" />
            ) : (
              "Continue"
            )}
          </NextBtn>
        </Step>
        <Step index={2}>
          <Outro />
          <NextBtn className="w-4/6" asChild>
            <Link href={DEFAULT_LOGIN_REDIRECT}>Get started</Link>
          </NextBtn>
        </Step>
      </StepperContainer>
    </Stepper>
  );
}
