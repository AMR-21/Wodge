import { getSrcLink } from "@/utils";
import { DrObj, Message } from "@repo/data";
import { env } from "@repo/env";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function ImageMessage({
  message,
  workspaceId,
}: {
  message: DrObj<Message>;
  workspaceId: string;
}) {
  const { channelId, teamId } = useParams<{
    channelId: string;
    teamId: string;
  }>();
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["image", message.id],
    queryFn: async () => {
      const res = await fetch(
        getSrcLink(message.id, workspaceId, channelId, teamId),
        {
          credentials: "include",
        },
      );

      const { downloadUrl } = await res.json<{
        downloadUrl: string;
      }>();

      return downloadUrl;
    },
    enabled: message.type !== "text",

    staleTime: 24 * 60 * 60 * 7,
  });
  return (
    <div className="relative h-56 w-72 overflow-hidden rounded-md">
      {data && (
        <img
          src={data}
          alt={message.content}
          className="absolute inset-0 h-full w-full object-cover text-transparent"
          loading="lazy"
        />
      )}
    </div>
  );
}
