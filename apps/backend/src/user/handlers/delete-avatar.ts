import { Context } from "hono";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "../../lib/get-s3-client";
import { makeUserAvatarKey, PublicUserType, UserType } from "@repo/data";
import UserParty from "../user-party";

export async function deleteAvatar(party: UserParty, c: Context) {
  const s3Client = getS3Client(party.room);

  const bucket = "avatars";
  let key = makeUserAvatarKey(party.room.id);

  const res = await fetch(
    `${party.room.env.AUTH_DOMAIN}/api/update-user-avatar`,
    {
      method: "DELETE",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
        userId: party.room.id,
      },
    }
  );

  if (!res.ok) return c.json({ error: "Failed to delete avatar" }, 400);

  const { user } = (await res.json()) as { user: UserType };

  if (!user) return c.json({ error: "Failed to delete avatar" }, 400);
  key = user.avatar?.split("/").pop()!;

  if (!key) return c.json({ error: "Failed to delete avatar" }, 400);

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

      return c.json({ message: "File deleted successfully" }, 200);
    } else {
      return c.json({ message: "File not deleted" }, 400);
    }
  }
}
