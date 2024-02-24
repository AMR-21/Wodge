"use client";

import { Button, UserCard } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useCacheUser } from "@repo/ui";
import { AddWorkspaceDialog } from "@/components/home/add-workspace-dialog";
import { WorkspacesList } from "@/components/home/workspaces-list";

function HomePage() {
  const router = useRouter();

  // Cache the user data on login or sign up
  const isCached = useCacheUser();

  // To avoid errors of accessing the local storage before it's initialized
  if (!isCached) return null;

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

      <div className="w-full max-w-xs ">
        <p className="mb-2 text-xs text-muted-foreground">Your Workspaces</p>
        <div className="min-h-0 rounded-md border border-border/50 bg-page">
          <div className="flex max-h-72 grow flex-col items-center overflow-y-scroll ">
            <WorkspacesList />
          </div>
        </div>

        <AddWorkspaceDialog />
      </div>
    </div>
  );
}

export default HomePage;
