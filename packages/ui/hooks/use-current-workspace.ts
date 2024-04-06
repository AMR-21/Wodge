import { WorkspaceContext } from "../components/workspace-provider";
import { useContext } from "react";

export function useCurrentWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useCurrentWorkspace must be used within a WorkspaceProvider",
    );
  }

  return context;
}
