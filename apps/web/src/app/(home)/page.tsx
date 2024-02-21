"use client";

import { WorkspaceItem } from "@/components/home/workspace-item";
import {
  Avatar,
  AvatarImage,
  UserCard,
  useLogin,
} from "../../../../../packages/ui";
import { useLocalUser } from "../../../../../packages/ui";
import { Button, Separator } from "../../../../../packages/ui";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

function HomePage() {
  const user = useLocalUser();
  const router = useRouter();

  // @ts-ignore
  // const spaces = useWorkspaces();
  const spaces = useWorkspaces();
  useLogin();
  if (!user) return null;

  async function onClick() {
    const res = await fetch(
      `http://localhost:1999/parties/user/${user?.data?.id}`,
      {
        credentials: "include",
      },
    );

    console.log(await res.json());
  }

  console.log(spaces);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden ">
      <UserCard className="absolute right-10 top-10" />
      <Button
        className="group absolute left-10 top-10 items-center text-sm"
        size="sm"
        variant="secondary"
        onClick={() => router.back()}
      >
        Back
      </Button>
      {/* TODO read workspaces from local and render it */}
      <div className="w-full max-w-xs ">
        <p className="mb-2 text-xs text-muted-foreground">Your workspaces</p>
        <div className="min-h-0 rounded-md border border-border/50 bg-page">
          <div className="flex max-h-72 grow flex-col items-center overflow-y-scroll ">
            <WorkspaceItem />
            <Separator className="w-full bg-border/50" />
            <WorkspaceItem />

            {/* {spaces?.map((space: any) => <p>{space.id}</p>)} */}
            {/* {JSON.stringify(Object.keys(spaces))} */}
          </div>

          {/* <p className="p-5 text-center text-muted-foreground">
            Join or create workspace to start using Wodge
          </p> */}
        </div>

        <Button
          onClick={() => {
            user.store.mutate.createSpace({
              id: nanoid(),
              name: "new workspace",
            });
          }}
        >
          xx
        </Button>
        <Button
          onClick={() => {
            user.store.pull();
          }}
        >
          pl
        </Button>
        <Button
          onClick={async () => {
            const res = await fetch(
              `http://localhost:1999/parties/user/${user.data?.id}`,
              {
                credentials: "include",
              },
            );

            console.log(await res.json());
          }}
        >
          pl3
        </Button>
        <Button className="mt-6 w-full" size="default">
          Join or create workspace
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
