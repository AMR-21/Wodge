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
import { format } from "date-fns";
import {
  GanttChart,
  Image,
  MoreHorizontal,
  Plus,
  Send,
  Vote,
} from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ThreadEditor } from "./thread-editor";

function ThreadsPage() {
  const { structure, workspaceSlug, workspaceRep } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  // const editor = useThreadEditor();

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
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Tabs defaultValue="posts" className="h-full">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="w-full">
            Posts
          </TabsTrigger>
          <TabsTrigger value="qa" className="w-full">
            Q&A
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-full w-full py-2">
          <TabsContent value="posts" className="">
            <ThreadEditor />
            <div className="flex flex-col gap-1 py-4">
              {posts?.map((post) => <Post key={post.id} post={post} />)}
            </div>
          </TabsContent>

          <TabsContent value="qa" className="">
            <ThreadEditor isQA />
            <div className="flex flex-col gap-1 py-4">
              {qas?.map((post) => <Post isQA key={post.id} post={post} />)}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export default ThreadsPage;
