import { useParams } from "next/navigation";

export function useWorkspaceId() {
  const { workspaceId } = useParams() as { workspaceId: string };

  return workspaceId;
}
