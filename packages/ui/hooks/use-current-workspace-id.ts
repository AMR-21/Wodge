import { useParams } from "next/navigation";

export function useCurrentWorkspaceId() {
  const { workspaceId } = useParams() as { workspaceId: string };

  return workspaceId;
}
