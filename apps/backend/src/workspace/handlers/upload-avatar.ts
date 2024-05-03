import WorkspaceParty from "../workspace-party";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Context } from "hono";
import { makeWorkspaceAvatarKey, REPLICACHE_VERSIONS_KEY } from "@repo/data";

export async function uploadAvatar(party: WorkspaceParty, c: Context) {
  const s3Client = new S3Client({
    region: "us-east-1",
    endpoint: party.room.env.ENDPOINT as string,
    credentials: {
      accessKeyId: party.room.env.ACCESS_KEY as string,
      secretAccessKey: party.room.env.SECRET_KEY as string,
    },
  });

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

    party.versions.set(
      "workspaceInfo",
      party.versions.get("workspaceInfo")! + 1
    );

    await Promise.all([
      party.poke(),
      party.room.storage.put(REPLICACHE_VERSIONS_KEY, party.versions),
    ]);

    return c.json({ response }, 200);
  } catch (error) {
    return c.json(error, 400);
  }
}
