import { Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";

interface ProfileAvatarProps {
  avatar: string;
  fallback: string;
  className?: string;
}

// TODO: Allow user to upload their own avatar here
export function ProfileAvatar({
  avatar = "/avatar.svg",
  fallback = "",
  className,
}: ProfileAvatarProps) {
  return (
    <Avatar className={cn("h-20 w-20", className)}>
      <AvatarImage src={avatar} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
