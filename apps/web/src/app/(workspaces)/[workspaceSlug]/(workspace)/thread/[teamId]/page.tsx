"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentWorkspace } from "@/components/workspace-provider";

import { useParams } from "next/navigation";
import { useMemo } from "react";

import { PostsList } from "./posts-list";
import { QAsList } from "./qas-list";

function ThreadsPage() {
  const { structure } = useCurrentWorkspace();

  const { teamId } = useParams<{ teamId: string }>();

  const team = useMemo(
    () => structure.teams?.find((t) => t.id === teamId),
    [structure.teams, teamId],
  );

  return (
    <div className="flex h-full w-full flex-col gap-4 px-2 py-3">
      <Tabs defaultValue="posts" className="h-full">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="w-full">
            Posts
          </TabsTrigger>
          <TabsTrigger value="qa" className="w-full">
            Q&A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostsList team={team} />
        </TabsContent>
        <TabsContent value="qa">
          <QAsList team={team} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ThreadsPage;
