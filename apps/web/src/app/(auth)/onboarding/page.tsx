"use client";

import { OnboardingProvider } from "@/app/(auth)/onboarding/onboarding-context";
import { OnboardingSteps } from "@/app/(auth)/onboarding/onboarding-steps";
import { useCurrentUser } from "@/hooks/use-current-user";

function OnboardingPage() {
  const { user } = useCurrentUser();

  if (!user) return null;

  return (
    <div className="dark:bg-grid-white/[0.2] bg-grid-black/[0.2] flex min-h-screen items-center justify-center ">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background  opacity-85 [mask-image:radial-gradient(ellipse_at_center)]" />
      <OnboardingProvider user={user}>
        <OnboardingSteps />
        {/* <EmailFor */}
      </OnboardingProvider>
    </div>
  );
}

export default OnboardingPage;
