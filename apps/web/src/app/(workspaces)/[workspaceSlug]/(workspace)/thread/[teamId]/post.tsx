import { DrObj, Thread } from "@repo/data";
import { format } from "date-fns";
import { SafeDiv } from "../../../../../../components/safe-div";
import { useMember } from "@repo/ui/hooks/use-member";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useParams } from "next/navigation";
import { memo, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { ThreadDropDown } from "../thread-dropdown";
import { EditEditor } from "./edit-editor";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useIsTeamModerator } from "@repo/ui/hooks/use-is-team-moderator";

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

    const [isEditing, setIsEditing] = useState(false);

    const { workspaceRep } = useCurrentWorkspace();
    const { member } = useMember(post.createdBy);
    const { user } = useCurrentUser();
    const isPrivileged = useIsTeamModerator();

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

            <ThreadDropDown
              label={isQA ? "question" : "post"}
              onDelete={async () => {
                await workspaceRep?.mutate.deleteChannel({
                  channelId: post.id,
                  teamId,
                  type: "thread",
                });
              }}
              onEdit={() => setIsEditing(true)}
              canEdit={post.createdBy === user?.id}
              canDelete={post.createdBy === user?.id || isPrivileged}
            />
          </div>

          {isEditing ? (
            <div className="w-full pl-9">
              <EditEditor
                post={post}
                onCancelEdit={() => {
                  setIsEditing(false);
                }}
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
            <SafeDiv className="BlockEditor pl-9" html={post.content} />
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
