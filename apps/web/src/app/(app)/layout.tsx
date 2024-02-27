import { AppHeader } from "@/components/workspace/app-header";
import { Sidebar } from "@/components/workspace/sidebar";
import { WorkspaceProvider } from "@/components/workspace/workspace-provider";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="flex h-dvh flex-col  bg-background">
        <AppHeader />
        <div className="flex h-dvh max-h-dvh min-h-0">
          <Sidebar />
          {children}
        </div>
      </div>
    </WorkspaceProvider>
  );
}

export default AppLayout;
