"use client";

import { SafeDiv } from "@/components/safe-div";
import { Post } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/thread/[teamId]/post";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { AddThreadForm } from "@/components/workspace/sidebar/add-thread-form";
import { Thread, WORKSPACE_GROUP_ID_LENGTH } from "@repo/data";
import { OfflineEditor, useThreadEditor } from "@repo/editor";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@repo/ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ThreadEditor } from "./thread-editor";

function ThreadsPage() {
  const { structure } = useCurrentWorkspace();

  const { teamId } = useParams<{ teamId: string }>();

  const team = useMemo(
    () => structure.teams?.find((t) => t.id === teamId),
    [structure.teams, teamId],
  );

  const posts = useMemo(
    () => team?.threads.filter((thread) => thread.type === "post"),
    [team?.threads],
  );

  const qas = useMemo(
    () => team?.threads.filter((thread) => thread.type === "qa"),
    [team?.threads],
  );

  const [active, setActive] = useState("posts");

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
          <TabsContent value="posts" className="pb-4">
            <ThreadEditor />
            <div className="flex flex-col gap-2.5 py-4">
              {posts?.map((post) => <Post key={post.id} post={post} />)}
            </div>
          </TabsContent>

          <TabsContent value="qa" className="pb-4">
            <ThreadEditor isQA />
            <div className="flex flex-col gap-1.5 py-4">
              {qas?.map((post) => <Post isQA key={post.id} post={post} />)}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export default ThreadsPage;
