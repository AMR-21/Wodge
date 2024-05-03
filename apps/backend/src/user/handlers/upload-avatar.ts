import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Context } from "hono";
import { makeUserAvatarKey, REPLICACHE_VERSIONS_KEY } from "@repo/data";
import UserParty from "../user-party";

export async function uploadAvatar(party: UserParty, c: Context) {
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

  const key = makeUserAvatarKey(party.room.id);

  try {
    const input = {
      Body: file,
      Bucket: "avatars",
      Key: key,
      ContentType: file.type,
    };
    // Inform the DB
    const res = await fetch(
      `${party.room.env.AUTH_DOMAIN}/api/update-user-avatar`,
      {
        method: "POST",
        headers: {
          authorization: party.room.env.SERVICE_KEY as string,
          userId: party.room.id,
        },
      }
    );

    if (!res.ok) return c.json({ error: "Failed to update avatar" }, 400);

    const command = new PutObjectCommand(input);
    const response = await s3Client.send(command);

    const workspaceParty = party.room.context.parties.workspace!;

    const req = [...party.workspacesStore].map((wid) => {
      return workspaceParty.get(wid).fetch("/member-update", {
        method: "POST",
        headers: {
          Authorization: party.room.env.SERVICE_KEY as string,
        },
      });
    });

    await Promise.all(req);

    return c.json({ response }, 200);
  } catch (error) {
    return c.json(error, 400);
  }
}
