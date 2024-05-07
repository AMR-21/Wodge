"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

import { useParams } from "next/navigation";
import { useMemo } from "react";

import { PostsList } from "./posts-list";
import { QAsList } from "./qas-list";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

function ThreadsPage() {
  const { structure } = useCurrentWorkspace();

  const { teamId } = useParams<{ teamId: string }>();

  const team = useMemo(
    () => structure.teams?.find((t) => t.id === teamId),
    [structure.teams, teamId],
  );

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Tabs defaultValue="posts" className="h-full">
        <div className="px-2">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="w-full">
              Posts
            </TabsTrigger>
            <TabsTrigger value="qa" className="w-full">
              Q&A
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-full w-full px-2 py-2">
          <TabsContent value="posts">
            <PostsList team={team} />
          </TabsContent>
          <TabsContent value="qa">
            <QAsList team={team} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export default ThreadsPage;
