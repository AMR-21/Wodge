import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Context } from "hono";
import { makeUserAvatarKey, REPLICACHE_VERSIONS_KEY } from "@repo/data";
import UserParty from "../user-party";
import { getS3Client } from "../../lib/get-s3-client";
import { nanoid } from "nanoid";

export async function uploadAvatar(party: UserParty, c: Context) {
  const s3Client = getS3Client(party.room);

  const body = await c.req.parseBody();

  const file = body["file"] as File;

  const key = c.req.query("key") || nanoid(12);

  try {
    const input = {
      Body: file,
      Bucket: "avatars",
      Key: makeUserAvatarKey(key),
      ContentType: file.type,
    };
    // Inform the DB
    // const res = await fetch(
    //   `${party.room.env.AUTH_DOMAIN}/api/update-user-avatar`,
    //   {
    //     method: "POST",
    //     headers: {
    //       authorization: party.room.env.SERVICE_KEY as string,
    //       userId: party.room.id,
    //       key,
    //     },
    //   }
    // );

    // if (!res.ok) return c.json({ error: "Failed to update avatar" }, 400);

    const command = new PutObjectCommand(input);
    const response = await s3Client.send(command);

    const workspaceParty = party.room.context.parties.workspace!;

    const req = [...party.workspacesStore].map((wid) => {
      return workspaceParty.get(wid).fetch("/service/member-update", {
        method: "POST",
        headers: {
          Authorization: party.room.env.SERVICE_KEY as string,
        },
      });
    });

    await Promise.all(req);

    return c.json({ response, key }, 200);
  } catch (error) {
    console.log(error);
    return c.json(error, 400);
  }
}
