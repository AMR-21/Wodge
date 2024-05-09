import { getSrcLink } from "@/utils";
import { DrObj, Message } from "@repo/data";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function VideoMessage({
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
    queryKey: ["video", message.id],
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
    <div className="  rounded-md">
      {data && (
        <video
          controls
          className="aspect-video max-h-[10.125rem] max-w-72 rounded-md "
        >
          <source src={data} type="video/webm" />
        </video>
      )}
    </div>
  );
}
