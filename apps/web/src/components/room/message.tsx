import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useMember } from "@repo/ui/hooks/use-member";
import { format } from "date-fns";
import { DrObj, Message as MessageType } from "@repo/data";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { MoreHorizontal } from "lucide-react";
import React, { memo, useRef, useState } from "react";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { env } from "@repo/env";
import { Button } from "@repo/ui/components/ui/button";
import { SafeDiv } from "../safe-div";

export const Message = memo(
  ({
    message,
    lastSenderId,
  }: {
    message: MessageType | DrObj<MessageType>;
    lastSenderId?: string;
  }) => {
    const { member, isMembersPending } = useMember(message.sender);
    const { workspaceId } = useCurrentWorkspace();
    const { teamId } = useParams<{ teamId: string }>();

    const queryClient = useQueryClient();

    const [download, setDownload] = useState(false);

    const imageUrlRef = useRef<string | undefined>(
      queryClient.getQueryData(["image", message.id]),
    );

    const { data, isPending, isFetching } = useQuery({
      queryKey: ["image", message.id],
      queryFn: async () => {
        const res = await fetch(
          `${env.NEXT_PUBLIC_FS_DOMAIN}/object/download/${btoa(workspaceId!).toLowerCase()}/${teamId}/${message.id}`,
        );

        const { downloadurl } = await res.json<{
          downloadurl: string;
        }>();

        setDownload(false);

        return downloadurl;
      },
      enabled: !!(workspaceId && teamId && message.type === "image"),
      persister: undefined,
      staleTime: 3600,
    });

    if (isMembersPending) return null;

    return (
      <div className="group break-words rounded-md p-1.5 transition-all hover:bg-secondary">
        <div className="flex items-start gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={member?.avatar} alt={member?.displayName} />
            <AvatarFallback>{member?.displayName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <p className="text-sm">{member?.displayName}</p>
            <p className="pt-0.5 text-xs text-muted-foreground">
              {format(message.date, "yyyy/MM/dd h:mm a")}
            </p>
          </div>

          <SidebarItemBtn
            Icon={MoreHorizontal}
            className="invisible ml-auto transition-all group-hover:visible"
          />
        </div>

        {/* <p className="">{message.content}</p> */}

        <div className="pl-9">
          {message.type === "image" && (
            <>
              {(data || imageUrlRef.current) && (
                <img
                  src={data || imageUrlRef.current}
                  className="aspect-auto h-full w-1/2 rounded-md object-cover"
                />
              )}

              {!data && (
                <div className="flex h-24 w-1/2 items-center justify-center">
                  <Button
                    isPending={isFetching}
                    onClick={() => setDownload(true)}
                  >
                    Download
                  </Button>
                </div>
              )}
            </>
          )}
          {message.type === "text" && (
            <>
              {/* <div>{message.content}</div> */}
              <SafeDiv
                className="MessageEditor text-sm"
                html={message.content}
              />
              {/* <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      className="text-sky-500  dark:text-sky-400"
                    />
                  ),
                }}
                className="prose prose-neutral -mt-1  text-sm text-foreground dark:prose-invert"
              >
                {message.content}
              </Markdown> */}
            </>
          )}
        </div>
      </div>
    );
  },
);
