import { WorkspaceType } from "@repo/data";
import { Separator, useWorkspaces } from "@repo/ui";
import { WorkspaceItem } from "./workspace-item";
import { useUserWorkspaces } from "@repo/ui";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function WorkspacesList() {
  // const { workspaces, isPending } = useWorkspaces();
  const userWorkspaces = useUserWorkspaces();

  // const workspacesLoading = !workspaces && isPending;
  // const noWorkspacesData = !workspaces && !isPending;

  // console.log(userWorkspaces);

  return null;

  // if (workspacesLoading)
  //   return (
  //     <div className="w-full">
  //       {Array.from({ length: 4 }).map((_, i) => (
  //         <WorkspaceItem.Skeleton key={i} />
  //       ))}
  //     </div>
  //   );

  // if ((!workspacesLoading && noUserWorkspaces) || noWorkspacesData)
  //   return (
  //     <p className="p-5 text-center text-muted-foreground">
  //       Join or create workspace to start using Wodge
  //     </p>
  //   );

  // const length = Object.values(workspaces || {}).length;
  // return (
  //   <>
  //     {workspaces &&
  //       Object.values(workspaces).map((workspace: WorkspaceType, i) => {
  //         return (
  //           <div className="w-full" key={workspace.id}>
  //             <WorkspaceItem workspace={workspace} />
  //             {i !== length - 1 && <Separator className="bg-border/50" />}
  //           </div>
  //         );
  //       })}
  //   </>
  // );
}
