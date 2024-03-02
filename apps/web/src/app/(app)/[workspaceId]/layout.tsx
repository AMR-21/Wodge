import { WorkspaceProvider } from "@/components/workspace/workspace-provider";

function AppProviders({ children }: { children: React.ReactNode }) {
  // check the current user participation in the workspace
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

export default AppProviders;
