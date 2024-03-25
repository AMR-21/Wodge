import { AppHeader } from "@/components/workspace/app-header";
import { Sidebar } from "@/components/workspace/sidebar/sidebar";
import { TabsRail } from "@/components/workspace/tabs-rail";
import { Button } from "@repo/ui/components/ui/button";
import { Home } from "lucide-react";

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="flex h-dvh w-full flex-col bg-background">
        <AppHeader />
        <div className="max-h-dv h flex h-dvh min-h-0 overflow-y-hidden">
          <TabsRail />
          <Sidebar />
          {children}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLayout;
