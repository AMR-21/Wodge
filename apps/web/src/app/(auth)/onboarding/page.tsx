import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps";
import { currentUser } from "@/lib/server-utils";
import { getUserById } from "@repo/data";
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
      </OnboardingProvider>
    </div>
  );
}

export default OnboardingPage;
