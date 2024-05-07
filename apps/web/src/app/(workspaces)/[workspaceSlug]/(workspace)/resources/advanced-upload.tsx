"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { SidebarItemBtn } from "../_components/sidebar-item-btn";
import { Plus } from "lucide-react";
import Uppy from "@uppy/core";
import { useMemo, useRef, useState } from "react";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";
import { roomMutators } from "@repo/data";
import { Replicache } from "replicache";
import { env } from "@repo/env";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

export function AdvancedUploadButton({
  bucketId,
  rep,
}: {
  bucketId: string;
  rep?: Replicache<typeof roomMutators>;
}) {
  const [open, setOpen] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);
  const [folder, setFolder] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { teamId, path } = useParams<{ teamId: string; path?: string[] }>();
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
        .on("upload", (e) => {
          completeUpload(e.fileIDs);
        })
        .on("upload-success", (e) => {
          setResetFlag((prev) => !prev);
          setFolder("");
          setOpen(false);
        }),
    [resetFlag],
  );

  async function completeUpload(fileIds: string[]) {
    if (!user) return;

    const file = uppyRef
      .getFiles()
      .filter((f) => fileIds.includes(f.id))
      .at(0);

    if (!file) return;

    const folder = inputRef.current?.value;
    const filePath = folder
      ? folder + "/" + file.name
      : path
        ? path.join("/") + "/" + file.name
        : file.name;

    const base64 = btoa(filePath);

    uppyRef.use(XHRUpload, {
      limit: 1,
      method: "POST",
      endpoint: `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${bucketId}/files/${teamId}/${base64}`,
      withCredentials: true,
    });

    queryClient.invalidateQueries({
      queryKey: ["resources", teamId],
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarItemBtn Icon={Plus} className="" />
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-72 ">
        <Dashboard
          uppy={uppyRef}
          id="dashboard"
          height={"auto"}
          width={240}
          className="flex justify-center"
        />

        <div className="space-y-1">
          <Label htmlFor="file-path">File path</Label>
          <Input
            ref={inputRef}
            id="file-path"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          />
          <p className="break-words pt-2 text-xs text-muted-foreground">
            Optionally you can provide a path for the file otherwise we will use
            the current active path.
          </p>
          <p className="break-words text-xs text-muted-foreground">
            For example "newFolder" will create a new folder called newFolder
            and the upload the file inside it.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
