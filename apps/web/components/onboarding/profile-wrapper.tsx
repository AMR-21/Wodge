import { Profile } from "@/data/schemas/db.schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileForm } from "./form-profile";

export function ProfileWrapper({ profile }: { profile?: Partial<Profile> }) {
  // console.log(profile);

  return (
    <Card className="flex w-full flex-col items-center border-none bg-background p-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-3xl">
          Complete your profile
        </CardTitle>
      </CardHeader>

      <CardContent className="flex w-full max-w-[350px] flex-col space-y-3 p-0">
        <ProfileAvatar
          avatar={profile?.avatar || ""}
          fallback={profile?.displayName || ""}
          className="self-center"
        />

        <ProfileForm profile={profile} />
        {/* <div className=" w-full bg-red-400">
          <div className="">avatar</div>
        </div> */}
      </CardContent>
    </Card>
  );
}
