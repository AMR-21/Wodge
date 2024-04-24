"use client";

import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

function OnboardingPage() {
  const { user } = useCurrentUser();

  if (!user) return null;
  return (
    <div className="flex min-h-screen items-center justify-center">
      <OnboardingProvider user={user}>
        <OnboardingSteps />
        {/* <EmailFor */}
      </OnboardingProvider>
    </div>
  );
}

export default OnboardingPage;
