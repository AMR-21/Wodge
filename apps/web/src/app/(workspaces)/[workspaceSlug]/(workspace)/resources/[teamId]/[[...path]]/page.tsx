"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentResources } from "@repo/ui/hooks/use-current-resources";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import Link from "next/link";

import { AdvancedUploadButton } from "@/components/resources/advanced-upload";

import { File } from "@/components/resources/file";
import { Folder } from "@/components/resources/folder";
import { useRouter } from "next/navigation";
import { FoldersBreadcrumbs } from "@/components/resources/folders-breadcrumbs";

const paths = [
  "x.pdf",
  "y.pdf",
  "amr/t.pdf",
  "ali/tsd.pdf",
  "amr/yasser/s.pdf",
  "amr/yasser/ali/s.pdf",
];

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
      <div className="flex h-8 items-center px-3 py-1.5">
        <FoldersBreadcrumbs />
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

export default TeamResourcePage;
