import { useCurrentResources } from "@/hooks/use-current-resources";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Folder } from "./folder";

export function Folders({ workspaceId }: { workspaceId: string }) {
  const { files, dirs, curPath } = useCurrentResources();
  const { workspaceSlug, teamId } = useParams<{
    workspaceSlug: string;
    teamId: string;
  }>();

  return (
    <>
      {dirs.map((d, i) => (
        <Link
          key={i}
          href={`/${workspaceSlug}/resources/${teamId}/${curPath ? curPath + "/" : ""}${d}`}
          className="w-full"
        >
          <Folder name={d} key={i} />
        </Link>
      ))}
    </>
  );
}
