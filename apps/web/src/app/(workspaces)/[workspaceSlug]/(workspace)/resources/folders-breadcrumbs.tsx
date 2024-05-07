import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";

export function FoldersBreadcrumbs() {
  const { workspaceSlug, teamId, path } = useParams<{
    workspaceSlug: string;
    teamId: string;
    path: string[];
  }>();

  return (
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
  );
}
