"use client";

import { ThreadAction } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/thread/[teamId]/[channelId]/thread-actions";
import { ThreadMessagesList } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/thread/[teamId]/[channelId]/thread-msgs-list";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { OfflineEditor, useThreadEditor } from "@repo/editor";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useMember } from "@repo/ui/hooks/use-member";
import { useUpdateRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";
import { useCurrentThreadRep } from "@repo/ui/hooks/use-thread-rep";
import { Send } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Post } from "../post";
import { CommentEditor } from "./comment-editor";
import { PostPage } from "./post-page";
import { QAPage } from "./qa-page";

function ChannelPage() {
  useUpdateRecentlyVisited("thread");
  const path = useChannelPath();

  const rep = useCurrentThreadRep();

  if (path?.thread?.type === "post") return <PostPage rep={rep} />;

  return <QAPage rep={rep} />;
}

export default ChannelPage;
