import { getSrcLink } from "@/utils";
import { DrObj, Message } from "@repo/data";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function AudioMessage({
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
    queryKey: ["audio", message.id],
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
    <>
      {data && (
        <div className="py-1">
          <audio controls>
            <source src={data} type="audio/webm" />
          </audio>
        </div>
      )}
    </>
  );
}
