"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { Plus } from "lucide-react";
import Uppy from "@uppy/core";
import { useMemo, useState } from "react";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/react";
import { useParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { msgsAtom } from "./message-list";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";
import { roomMutators } from "@repo/data";
import { Replicache } from "replicache";
import { env } from "@repo/env";

export function UploadButton({
  bucketId,
  rep,
}: {
  bucketId: string;
  rep?: Replicache<typeof roomMutators>;
}) {
  const [open, setOpen] = useState(false);

  const { teamId } = useParams<{ teamId: string }>();
  const setMessages = useSetAtom(msgsAtom);
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const uppyRef = useMemo(
    () =>
      new Uppy({
        allowMultipleUploadBatches: false,
        restrictions: {
          allowedFileTypes: [
            "image/*",
            "text/*",
            "audio/*",
            "video/*",
            "application/*",
            ".ppsx",
          ],
          maxNumberOfFiles: 1,
        },
      })
        .use(XHRUpload, {
          limit: 1,

          method: "POST",
          endpoint: `${env.NEXT_PUBLIC_FS_DOMAIN}/object/put/${btoa(bucketId).toLowerCase()}/${"messages+" + teamId}`,
          headers: {
            "x-workspace-id": bucketId,
          },
        })
        .on("complete", (e) => {
          const fileId = e.successful[0]?.response?.body?.fileId as
            | string
            | undefined;

          if (fileId && user) {
            setOpen(false);

            completeUpload(
              fileId,
              e.successful[0]?.response?.body?.signedUrl as string,
            );

            cancel();
          }
        }),
    [rep],
  );

  function cancel() {
    uppyRef.cancelAll();
    setOpen(false);
  }

  async function completeUpload(fileId: string, signedUrl: string) {
    if (!user) return;
    await rep?.mutate.sendMessage({
      sender: user.id,
      content: "aa",
      date: new Date().toISOString(),
      id: fileId,
      type: "image",
      reactions: [],
    });

    queryClient.setQueryData(["image", fileId], signedUrl);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarItemBtn Icon={Plus} className="mr-2" />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Dashboard
          uppy={uppyRef}
          id="dashboard"
          height={240}
          width={240}
          className="flex justify-center"
          theme="auto"
        />
      </PopoverContent>
    </Popover>
  );
}
