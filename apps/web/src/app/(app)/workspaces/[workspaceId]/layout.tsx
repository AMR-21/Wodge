import { WorkspaceProvider } from "@/components/workspace/workspace-context";

function AppProviders({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

export default AppProviders;
