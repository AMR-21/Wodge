import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileForm } from "./profile-form";
import { useOnboarding } from "./onboarding-context";

export function ProfileWrapper() {
  const { profile } = useOnboarding();

  return (
    <Card className="flex w-full flex-col items-center border-none bg-background p-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Complete your profile</CardTitle>
        <CardDescription>
          You can change your profile at anytime
        </CardDescription>
      </CardHeader>

      <CardContent className="flex w-full max-w-[350px] flex-col justify-center space-y-3 p-0">
        <ProfileAvatar fallback={profile?.displayName || ""} />

        <ProfileForm />
      </CardContent>
    </Card>
  );
}
