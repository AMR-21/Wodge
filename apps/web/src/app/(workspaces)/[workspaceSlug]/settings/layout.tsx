"use client";

import { SettingsContent } from "@/components/settings/settings";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { isAdmin, isOwner } from "@repo/data";
import { Sheet } from "@repo/ui/components/ui/sheet";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <Sheet>
        <SettingsSidebar />
        <SettingsContent>
          <div className="flex h-full w-full">{children}</div>
        </SettingsContent>
      </Sheet>
    </div>
  );
}

export default SettingsLayout;
