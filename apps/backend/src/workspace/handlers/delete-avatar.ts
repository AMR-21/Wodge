import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "../../lib/get-s3-client";
import { makeWorkspaceAvatarKey } from "@repo/data";

export async function deleteAvatar(party: WorkspaceParty, c: Context) {
  const s3Client = getS3Client(party.room);

  const key = makeWorkspaceAvatarKey(party.room.id);

  const checkFile = await getSignedUrl(
    s3Client,
    new HeadObjectCommand({ Bucket: "avatars", Key: key }),
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
      new DeleteObjectCommand({ Bucket: "avatars", Key: key }),
      { expiresIn: 3600 }
    );
    let response = await fetch(deleteUrl, {
      method: "DELETE",
    });
    if (response.status === 204) {
      return c.json({ message: "File deleted successfully" }, 200);
    } else {
      return c.json({ message: "File not deleted" }, 400);
    }
  }
}
