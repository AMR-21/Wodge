import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { ProfileForm } from "./profile-form";

export function ProfileWrapper() {
  return (
    <Card className="flex w-full flex-col items-center border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Complete your profile</CardTitle>
        <CardDescription>
          You can change your profile at anytime
        </CardDescription>
      </CardHeader>

      <CardContent className="flex w-4/6 flex-col justify-center p-0">
        <ProfileForm />
      </CardContent>
    </Card>
  );
}
