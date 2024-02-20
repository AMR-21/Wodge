import { useLocalUser } from "../hooks/use-local-user";
import { UserAvatar } from "./user-avatar";

export function UserCard() {
  const user = useLocalUser();
  const data = user?.data;

  if (!data) return null;

  console.log(user.data);
  return (
    <div>
      <UserAvatar avatar={data.avatar} interactive={false} />
      <p>{data.displayName}</p>
      <p>{data.username}</p>
    </div>
  );
}
