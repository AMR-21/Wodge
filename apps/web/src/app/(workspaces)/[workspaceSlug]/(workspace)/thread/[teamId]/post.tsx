import { DrObj, Thread } from "@repo/data";
import { format } from "date-fns";
import { SafeDiv } from "../../../../../../components/safe-div";
import { useMember } from "@/hooks/use-member";
import { SafeAvatar } from "@/components/safe-avatar";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useParams, useRouter } from "next/navigation";
import { memo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThreadDropDown } from "../thread-dropdown";
import { EditEditor } from "./edit-editor";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useIsTeamModerator } from "@/hooks/use-is-team-moderator";
import { useEditEditor } from "./[channelId]/use-edit-editor";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDot } from "lucide-react";
import { useSetAtom } from "jotai";
import { recentlyVisitedAtom } from "@/store/global-atoms";
import { produce } from "immer";

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
    const { teamId, workspaceSlug } = useParams<{
      teamId: string;
      workspaceSlug: string;
    }>();

    const { isEditing, setIsEditing, onCancelEdit, onEdit } = useEditEditor();

    const { workspaceRep, workspaceId } = useCurrentWorkspace();
    const { member } = useMember(post.createdBy);
    const { user } = useCurrentUser();
    const isPrivileged = useIsTeamModerator();
    const router = useRouter();
    const setRecentAtom = useSetAtom(recentlyVisitedAtom);

    const Icon = post.isResolved ? CheckCircle2 : CircleDot;

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

              {isQA && (
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    post.isResolved
                      ? "text-purple-600 dark:text-purple-500"
                      : "text-green-600 dark:text-green-500",
                  )}
                />
              )}
            </div>

            <ThreadDropDown
              label={isQA ? "question" : "post"}
              onDelete={async () => {
                await workspaceRep?.mutate.deleteChannel({
                  channelId: post.id,
                  teamId,
                  type: "thread",
                });

                setRecentAtom((prev) => {
                  if (!workspaceId || !prev[workspaceId]) return prev;
                  const newRecent = produce(prev, (draft) => {
                    draft[workspaceId] = draft[workspaceId]!.filter(
                      (r) => r.channelId !== post.id,
                    );
                  });
                  return newRecent;
                });

                if (opened)
                  router.replace(`/${workspaceSlug}/thread/${teamId}`);
              }}
              onEdit={onEdit}
              canEdit={post.createdBy === user?.id}
              canDelete={post.createdBy === user?.id || isPrivileged}
            />
          </div>

          {isEditing ? (
            <div className="w-full pl-9">
              <EditEditor
                content={post}
                onCancelEdit={onCancelEdit}
                onSuccessEdit={async (text: string) => {
                  await workspaceRep?.mutate.updateThread({
                    ...post,
                    content: text,
                    teamId,
                  });

                  setIsEditing(false);
                }}
              />
            </div>
          ) : (
            <SafeDiv
              className="BlockEditor w-full overflow-hidden text-balance break-words pl-9"
              html={post.content}
            />
          )}
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
