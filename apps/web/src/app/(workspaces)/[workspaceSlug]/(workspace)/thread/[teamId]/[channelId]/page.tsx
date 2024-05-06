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

  const { user } = useCurrentUser();

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { member } = useMember(path?.thread?.createdBy);
  const editor = useThreadEditor({
    placeholder: "Add a comment...",
  });
  const { workspaceRep } = useCurrentWorkspace();

  const rep = useCurrentThreadRep();

  useEffect(() => {
    if (path?.thread?.isResolved) {
      editor?.setEditable(false);
      editor?.commands.clearContent();
    } else {
      editor?.setEditable(true);
    }
  }, [path]);

  if (!path) return null;

  async function onSubmit() {
    if (editor && user) {
      const content = editor.getHTML();

      await rep?.mutate.createThreadMessage({
        id: nanoid(),
        author: user.id,
        content,
        date: new Date().toISOString(),
        type: "message",
      });

      editor.commands.clearContent();
    }
  }

  async function toggleThread() {
    // add message to thread
    if (user)
      await rep?.mutate.createThreadMessage({
        id: nanoid(),
        author: user.id,
        content: "toggle",
        date: new Date().toISOString(),
        type: path?.thread?.isResolved ? "open" : "close",
      });

    await workspaceRep?.mutate.toggleThread({
      teamId,
      threadId: channelId,
    });
  }

  if (path?.thread?.type === "post") return <PostPage rep={rep} />;

  return <QAPage rep={rep} />;
}

export default ChannelPage;
