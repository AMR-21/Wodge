import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Download, File as FileIcon, Trash2 } from "lucide-react";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { getBucketAddress } from "@repo/data";
import { env } from "@repo/env";

export function File({
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
        "group items-center justify-start gap-2 rounded-none py-4 ",
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
            `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${wid}/file/${teamId}/${btoa(path + name)}`,
            { credentials: "include" },
          );

          const data = await res.json<{ downloadUrl: string }>();

          if (data.downloadUrl) {
            const tempLink = document.createElement("a");
            tempLink.href = data.downloadUrl;
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
            `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${wid}/files/${teamId}/${btoa(path + name)}`,
            {
              method: "DELETE",
              credentials: "include",
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
