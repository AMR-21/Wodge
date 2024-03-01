import { WorkspaceProvider } from "@/components/workspace/workspace-provider";

function AppProviders({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

export default AppProviders;
