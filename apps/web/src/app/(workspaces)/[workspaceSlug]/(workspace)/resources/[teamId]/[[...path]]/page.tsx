"use client";

import { buttonVariants } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentResources } from "@repo/ui/hooks/use-current-resources";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

import {
  Delete,
  Download,
  File as FileIcon,
  Folder as FolderIcon,
  Home,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { UploadButton } from "@/components/room/upload-button";
import { env } from "@repo/env";
import { useParams, useRouter } from "next/navigation";
import { getBucketAddress } from "@repo/data";
import { AdvancedUploadButton } from "@/components/resources/advanced-upload";
import { useQueryClient } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { Fragment } from "react";

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

  const router = useRouter();

  if (!workspaceId) return null;

  if (files?.length === 0 && dirs?.length === 0 && path?.length > 0) {
    router.back();
  }

  return (
    <div className="flex w-full flex-col py-4">
      <h2 className="text-xl">{activePath?.team} Resources</h2>
      <div className="flex h-8 items-center py-1.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${workspaceSlug}/resources/${teamId}`}>
                  <Home className="size-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {path?.length > 0 && <BreadcrumbSeparator />}
            {path?.length > 3 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {path?.slice(path.length - 2).map((p, i) => (
                  <Fragment key={i}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={`/${workspaceSlug}/resources/${teamId}/${path.slice(path.length - 2, i + path.length - 2 + 1).join("/")}`}
                        >
                          {p}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {i === 1 ? null : <BreadcrumbSeparator />}
                  </Fragment>
                ))}
              </>
            ) : (
              <>
                {path?.map((p, i) => (
                  <Fragment key={i}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={`/${workspaceSlug}/resources/${teamId}/${path.slice(0, i + 1).join("/")}`}
                        >
                          {p}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {i === path.length - 1 ? null : <BreadcrumbSeparator />}
                  </Fragment>
                ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <AdvancedUploadButton bucketId={workspaceId} />
        </div>
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

  const queryClient = useQueryClient();

  return (
    <div
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "sm",
        }),
        "group items-center justify-start gap-2 rounded-none py-4 text-base",
      )}
    >
      <FileIcon className="h-4 w-4" />
      <span>{name}</span>
      <SidebarItemBtn
        Icon={Download}
        className="invisible ml-2 group-hover:visible"
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
      <SidebarItemBtn
        Icon={Trash2}
        className="invisible group-hover:visible"
        onClick={async () => {
          const path = curPath ? curPath + "/" : "";

          const res = await fetch(
            `${env.NEXT_PUBLIC_FS_DOMAIN}/object/delete/${getBucketAddress(wid)}/${teamId}/${btoa(path + name)}`,
            {
              method: "POST",
            },
          );

          queryClient.invalidateQueries({
            queryKey: ["resources", teamId],
          });
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
