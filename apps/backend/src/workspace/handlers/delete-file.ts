import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "../../lib/get-s3-client";
import {
  getBucketAddress,
  makeWorkspaceAvatarKey,
  REPLICACHE_VERSIONS_KEY,
} from "@repo/data";
import { badRequest } from "../../lib/http-utils";

export async function deleteFile(
  party: WorkspaceParty,
  mode: "avatar" | "file" = "file",
  c: Context
) {
  if (mode === "file" && !c.req.param("path")) return badRequest();

  const bucket = mode === "file" ? getBucketAddress(party.room.id) : "avatars";
  const teamId = (mode === "file" && c.req.param("teamId")) || undefined;

  const s3Client = getS3Client(party.room);

  let key = teamId
    ? teamId + "/" + atob(c.req.param("path"))
    : makeWorkspaceAvatarKey(party.room.id);

  const checkFile = await getSignedUrl(
    s3Client,
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
  let checkFileResponse = await fetch(checkFile, {
    method: "HEAD",
  });
  if (checkFileResponse.statusText === "Not Found") {
    return c.json({ message: "File does not exist" }, 400);
  } else {
    const deleteUrl = await getSignedUrl(
      s3Client,
      new DeleteObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 3600 }
    );

    let response = await fetch(deleteUrl, {
      method: "DELETE",
    });

    if (response.status === 204) {
      // delete avatar in db
      if (mode === "avatar") {
        // Inform the DB
        const res = await fetch(
          `${party.room.env.AUTH_DOMAIN}/api/update-avatar`,
          {
            method: "DELETE",
            headers: {
              authorization: party.room.env.SERVICE_KEY as string,
              workspaceId: party.room.id,
            },
          }
        );

        if (!res.ok) return c.json({ error: "Failed to delete avatar" }, 400);

        const nextVersion = party.versions.get("workspaceInfo")! + 1;

        party.versions.set("workspaceInfo", nextVersion);
        party.versions.set("globalVersion", nextVersion);

        await party.room.storage.put(REPLICACHE_VERSIONS_KEY, party.versions);

        await party.poke();
      } else {
        const nextVersion = party.versions.get("workspaceInfo")! + 1;

        party.versions.set("workspaceInfo", nextVersion);
        party.versions.set("globalVersion", nextVersion);

        await party.room.storage.put(REPLICACHE_VERSIONS_KEY, party.versions),
          await party.poke({
            type: "team-files",
          });
      }

      return c.json({ message: "File deleted successfully" }, 200);
    } else {
      return c.json({ message: "File not deleted" }, 400);
    }
  }
}
