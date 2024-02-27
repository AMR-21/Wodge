"use client";

import { useCurrentWorkspace } from "@/components/workspace/workspace-provider";
import { Workspace } from "@repo/data/client-models";
// import { Button, useCurrentWsMetadata } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function SpacePage({ params }: { params: { workspaceId: string } }) {
  // TODO Protect undefined workspaceId
  // useCurrentWsMetadata();

  // const { workspaceId } = useParams();

  // useEffect(() => {
  //   if (!Workspace.hasInstance(workspaceId)) router.push("/me");
  // }, []);

  // if (!Workspace.hasInstance(workspaceId as string)) {
  //   router.replace("/me");
  // }

  // console.log(params);
  // const wrs = Workspace.getInstance("1");

  // console.log(Workspace);
  return <div className="basis-full">hhhhhh</div>;
}

export default SpacePage;
