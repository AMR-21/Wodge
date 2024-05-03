import WorkspaceParty from "../workspace-party";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Context } from "hono";
import { makeWorkspaceAvatarKey, REPLICACHE_VERSIONS_KEY } from "@repo/data";
import { getS3Client } from "../../lib/get-s3-client";

export async function uploadAvatar(party: WorkspaceParty, c: Context) {
  const s3Client = getS3Client(party.room);

  const body = await c.req.parseBody();

  const file = body["file"] as File;

  const key = makeWorkspaceAvatarKey(party.room.id);

  try {
    const input = {
      Body: file,
      Bucket: "avatars",
      Key: key,
      ContentType: file.type,
    };
    // Inform the DB
    const res = await fetch(`${party.room.env.AUTH_DOMAIN}/api/update-avatar`, {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
        workspaceId: party.room.id,
      },
    });

    if (!res.ok) return c.json({ error: "Failed to update avatar" }, 400);

    const command = new PutObjectCommand(input);
    const response = await s3Client.send(command);

    const nextVersion = party.versions.get("globalVersion")! + 1;

    party.versions.set("workspaceInfo", nextVersion);
    party.versions.set("globalVersion", nextVersion);
    await party.room.storage.put(REPLICACHE_VERSIONS_KEY, party.versions);

    await party.poke();

    return c.json({ response }, 200);
  } catch (error) {
    console.log("Error uploading avatar", error);
    return c.json(error, 400);
  }
}
