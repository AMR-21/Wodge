"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { Plus } from "lucide-react";
import Uppy from "@uppy/core";
import { useRef, useState } from "react";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/react";
import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { Button } from "@repo/ui/components/ui/button";
import { useSetAtom } from "jotai";
import { msgsAtom } from "./message-list";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";

export function UploadButton({ bucketId }: { bucketId: string }) {
  const [open, setOpen] = useState(false);

  const { teamId } = useParams<{ teamId: string }>();
  const setMessages = useSetAtom(msgsAtom);
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const uppyRef = useRef(
    new Uppy({
      allowMultipleUploadBatches: false,
      restrictions: {
        allowedFileTypes: ["image/*"],
        maxNumberOfFiles: 1,
      },
    })
      .use(XHRUpload, {
        limit: 1,

        formData: false,
        method: "POST",
        endpoint: `http://localhost:8787/object/put/${btoa(bucketId).toLowerCase()}/${teamId}`,
      })
      .on("complete", (e) => {
        const fileId = e.successful[0]?.response?.body?.fileId as
          | string
          | undefined;

        if (fileId && user) {
          setOpen(false);

          // Todo create Message

          setMessages((msgs) => [
            ...msgs,
            {
              content: ``,
              date: new Date().toISOString(),
              id: fileId,
              sender: user.id,
              type: "image",
            },
          ]);

          queryClient.setQueryData(
            ["image", fileId],
            e.successful[0]?.response?.body?.signedUrl,
          );

          cancel();
        }
      }),
  );

  function cancel() {
    uppyRef.current.cancelAll();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarItemBtn Icon={Plus} className="mr-2" />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Dashboard
          uppy={uppyRef.current}
          id="dahsboard"
          height={240}
          width={240}
          className="flex justify-center"
          theme="auto"
        />
      </PopoverContent>
    </Popover>
  );
}
