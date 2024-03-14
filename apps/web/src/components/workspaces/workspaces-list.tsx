import { WorkspaceItem } from "./workspace-item";
import { useUserWorkspaces } from "@repo/ui/hooks/use-user-workspaces";

export function WorkspacesList() {
  const { userWorkspaces, isPending } = useUserWorkspaces();

  if (isPending)
    return (
      <div className="w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <WorkspaceItem.Skeleton key={i} />
        ))}
      </div>
    );

  if (!isPending && (userWorkspaces?.length === 0 || !useUserWorkspaces))
    return (
      <p className="p-5 text-center text-muted-foreground">
        Join or create workspace to start using Wodge
      </p>
    );

  return (
    <div className="flex w-full flex-col divide-y-[1px] divide-border/50">
      {userWorkspaces &&
        Object.values(userWorkspaces)?.map((workspace) => (
          <WorkspaceItem key={workspace.workspaceId} workspace={workspace} />
        ))}
    </div>
  );
}
