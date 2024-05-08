"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { SidebarItemBtn } from "../_components/sidebar-item-btn";
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
import Webcam from "@uppy/webcam";

import Audio from "@uppy/audio";

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
        .use(Audio)
        .use(Webcam)
        .use(XHRUpload, {
          limit: 1,

          method: "POST",
          endpoint: `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/object/put/${btoa(bucketId).toLowerCase()}/${"messages+" + teamId}`,
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
        })
        .on("dashboard:show-panel", () => {}),
    [rep],
  );

  function cancel() {
    uppyRef.cancelAll();
    setOpen(false);
  }

  uppyRef.on("dashboard:show-panel", (p) => {
    console.log("show panel", p);
  });

  uppyRef.on("dashboard:modal-closed", () => {
    console.log("cancel all");
  });

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
      <PopoverContent className="p-1">
        <Dashboard
          uppy={uppyRef}
          id="dashboard"
          height={240}
          width={240}
          className="simple flex justify-center "
        />
      </PopoverContent>
    </Popover>
  );
}
