"use client";

import { WorkspaceItem } from "@/components/home/workspace-item";
import { UserCard } from "@repo/ui";
import { Button, Separator } from "@repo/ui";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-login";
import { useLocalUser } from "@/hooks/use-local-user";
import { AddWorkspaceDialog } from "@/components/home/add-workspace-dialog";
import { nanoid } from "nanoid";

function HomePage() {
  const user = useLocalUser();
  const router = useRouter();
  useLogin();
  const spaces = useWorkspaces();

  if (!user) return null;

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

        {/* <Button className="mt-6 w-full" size="default">
          Join or create workspace
        </Button> */}

        <Button
          onClick={async () => {
            await user.store.mutate.createSpace({
              id: nanoid(),
              name: "amr",
            });
          }}
        >
          psh
        </Button>
        <AddWorkspaceDialog />
      </div>
    </div>
  );
}

export default HomePage;
