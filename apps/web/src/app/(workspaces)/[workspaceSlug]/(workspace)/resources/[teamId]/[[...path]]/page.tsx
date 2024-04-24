"use client";

import { buttonVariants } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentResources } from "@repo/ui/hooks/use-current-resources";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

import {
  Download,
  File as FileIcon,
  Folder as FolderIcon,
  Plus,
} from "lucide-react";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { UploadButton } from "@/components/room/upload-button";
import { env } from "@repo/env";
import { useParams } from "next/navigation";
import { getBucketAddress } from "@repo/data";

const paths = [
  "x.pdf",
  "y.pdf",
  "amr/t.pdf",
  "ali/tsd.pdf",
  "amr/yasser/s.pdf",
  "amr/yasser/ali/s.pdf",
];

function isFile(path: string) {
  return !path.includes("/");
}

// 1 get current level
// get all files/folders in current level

function TeamResourcePage({
  params: { path, teamId, workspaceSlug },
}: {
  params: {
    workspaceSlug: string;
    teamId: string;
    path: string[];
  };
}) {
  const activePath = useChannelPath();

  const { workspaceId } = useCurrentWorkspace();

  const { files, dirs, curPath } = useCurrentResources();

  if (!workspaceId) return null;

  return (
    <div className="flex w-full flex-col py-4">
      <h2 className="text-xl">{activePath?.team} Resources</h2>
      <div className="flex">
        <p>breadcrumbs</p>
        <SidebarItemBtn Icon={Plus} className="ml-auto" />
      </div>
      <ScrollArea className="py-2.5">
        <div className="flex w-full flex-col divide-y-[1px]">
          {dirs.map((d, i) => (
            <Link
              key={i}
              href={`/${workspaceSlug}/resources/${teamId}/${curPath ? curPath + "/" : ""}${d}`}
              className="w-full"
            >
              <Folder name={d} key={i} />
            </Link>
          ))}
          {files.map((p, i) => (
            <File name={p} key={i} curPath={curPath} wid={workspaceId} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function File({
  name,
  curPath,
  wid,
}: {
  name: string;
  curPath?: string;
  wid: string;
}) {
  const { teamId } = useParams<{ teamId: string }>();
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "sm",
        }),
        "group items-center justify-start gap-2 rounded-none py-4",
      )}
    >
      <FileIcon className="h-4 w-4" />
      <span>{name}</span>
      <SidebarItemBtn
        Icon={Download}
        className="invisible ml-auto group-hover:visible"
        onClick={async () => {
          // download file
          const path = curPath ? curPath + "/" : "";
          const res = await fetch(
            `${env.NEXT_PUBLIC_FS_DOMAIN}/object/download/${getBucketAddress(wid)}/${teamId}/${btoa(path + name)}`,
          );

          const data = await res.json<{ downloadurl: string }>();

          if (data.downloadurl) {
            const tempLink = document.createElement("a");
            tempLink.href = data.downloadurl;
            tempLink.setAttribute("download", ""); // This attribute triggers the download instead of navigation
            tempLink.style.display = "none"; // Hide the anchor element

            // Append the anchor element to the document body
            document.body.appendChild(tempLink);

            // Simulate a click on the anchor element
            tempLink.click();

            // Clean up - remove the anchor element from the document body
            document.body.removeChild(tempLink);
          }
        }}
      />
    </div>
  );
}

function Folder({ name }: { name?: string }) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "sm",
        }),
        "w-full items-center justify-start gap-2 rounded-none py-4",
      )}
    >
      <FolderIcon className="h-4 w-4" />
      <span>{name}</span>
    </div>
  );
}

export default TeamResourcePage;
