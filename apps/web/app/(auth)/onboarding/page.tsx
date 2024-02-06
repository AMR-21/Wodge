// "use client";

import { StepsCarousal } from "@/components/onboarding/steps-carousal";
import { getProfileById } from "@/data/models/profiles";
import { currentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";

async function OnboardingPage() {
  const user = await currentUser();

  if (!user) return redirect("auth/login");

  const profile = await getProfileById(user.id);
  if (!profile) return redirect("auth/login");

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* <Button onClick={() => signOut({})}>sign out</Button> */}
      <StepsCarousal profile={profile} />
    </div>
  );
}

export default OnboardingPage;
