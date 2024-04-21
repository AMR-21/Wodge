import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps";
import { currentUser } from "@/lib/utils";
import { getUserById } from "@repo/data/server";
import { redirect } from "next/navigation";

export const runtime = "edge";

async function OnboardingPage() {
  const user = await currentUser();

  if (!user) return redirect("/login");

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
