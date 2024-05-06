import { DrObj, Thread } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";
import { SidebarItemBtn } from "../../../../../../components/workspace/sidebar-item-btn";
import { MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { SafeDiv } from "../../../../../../components/safe-div";
import { useMember } from "@repo/ui/hooks/use-member";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useParams } from "next/navigation";
import { memo } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { ThreadDropDown } from "../thread-dropdown";

export const Post = memo(
  ({
    post,
    opened = false,
    isQA = false,
  }: {
    post: Thread | DrObj<Thread>;
    opened?: boolean;
    isQA?: boolean;
  }) => {
    const { workspaceRep } = useCurrentWorkspace();
    const { teamId, workspaceSlug } = useParams<{
      teamId: string;
      workspaceSlug: string;
    }>();
    const { member } = useMember(post.createdBy);

    return (
      <div className="group overflow-hidden rounded-md border border-border/50 bg-dim ">
        <div className="flex w-full flex-col items-start px-2 py-4">
          <div className="flex w-full items-start gap-2">
            <SafeAvatar
              src={member?.avatar}
              fallback={member?.displayName[0] || "W"}
              className="h-7 w-7 rounded-full"
            />

            <div className="flex items-center gap-2">
              <p className="text-sm">
                {member?.displayName || "Workspace Member"}
              </p>
              <p className="pt-0.5 text-xs text-muted-foreground">
                {format(
                  post?.createdAt || "2024-05-06T01:35:51.267Z",
                  "yyyy/MM/dd h:mm a",
                )}
              </p>
            </div>

            <ThreadDropDown label={isQA ? "question" : "post"} />
          </div>

          <SafeDiv className="BlockEditor pl-9" html={post.content} />
        </div>

        {!opened && (
          <Button
            variant="ghost"
            size="sm"
            className="group/btn w-full justify-start rounded-none border-t border-border/50 pl-11 text-sm"
            asChild
          >
            <Link href={`/${workspaceSlug}/thread/${teamId}/${post.id}`}>
              <span className="opacity-50 transition-all group-hover/btn:opacity-100">
                Open {isQA ? "question" : "post"}
              </span>
            </Link>
          </Button>
        )}
      </div>
    );
  },
);
