import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { memo } from "react";

export const RoomHeader = memo(() => {
  const path = useChannelPath();

  if (!path) return null;

  const { room } = path;

  return (
    <header className="pl-2">
      <h2 className="text-2xl font-semibold">Welcome to {room}!</h2>
      <p className="text-sm">This the start of the {room} room</p>
    </header>
  );
});
