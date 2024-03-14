import { currentUser } from "@/lib/utils";
import { getUserById } from "@repo/data/server";
import { OnboardingProvider } from "@repo/ui/components/onboarding/onboarding-context";
import { OnboardingSteps } from "@repo/ui/components/onboarding/onboarding-steps";
import { redirect } from "next/navigation";

async function OnboardingPage() {
  const user = await currentUser();

  if (!user) return redirect("/login");

  const userData = await getUserById(user.id);

  if (!userData) return redirect("/login");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <OnboardingProvider user={userData}>
        <OnboardingSteps />
        {/* <EmailFor */}
      </OnboardingProvider>
    </div>
  );
}

export default OnboardingPage;
