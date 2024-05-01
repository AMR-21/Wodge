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
  // const {
  //   structure,
  //   members,
  //   isMembersPending,
  //   isStructurePending,
  //   workspaceSlug,
  // } = useCurrentWorkspace();
  // const { user, isUserPending } = useCurrentUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (isMembersPending || isStructurePending || isUserPending) return;

  //   if (!structure || !members || !user)
  //     return router.replace(`/${workspaceSlug}`);

  //   if (
  //     !isOwner({ members, userId: user?.id }) &&
  //     !isAdmin({ members, userId: user?.id })
  //   ) {
  //     return router.replace(`/${workspaceSlug}`);
  //   }
  // }, [structure, members, user]);

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
