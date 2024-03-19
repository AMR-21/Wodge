import { AppHeader } from "@/components/workspace/app-header";
import { Sidebar } from "@/components/workspace/sidebar/sidebar";

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col  bg-background">
      <AppHeader />
      <div className="flex h-dvh max-h-dvh min-h-0">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}

export default WorkspaceLayout;
