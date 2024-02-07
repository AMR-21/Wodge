import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps";
import { getProfileById } from "@repo/data";
import { currentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";

async function OnboardingPage() {
  const user = await currentUser();

  if (!user) return redirect("/login");

  const profile = await getProfileById(user.id);
  if (!profile) return redirect("auth/login");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <OnboardingProvider profile={profile}>
        <OnboardingSteps />
      </OnboardingProvider>
    </div>
  );
}

export default OnboardingPage;
