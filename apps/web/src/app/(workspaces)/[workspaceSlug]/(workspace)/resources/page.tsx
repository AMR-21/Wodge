"use client";

import { RecentCarousel } from "@/components/home/recent-carousel";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { Plus } from "lucide-react";

function ResourcesPage() {
  const { workspace } = useCurrentWorkspace();

  return (
    <div className="container w-full space-y-4">
      <h2 className="text-center text-2xl font-semibold">
        {workspace?.name} Resources
      </h2>

      <RecentCarousel filter="resources" />
    </div>
  );
}

export default ResourcesPage;
