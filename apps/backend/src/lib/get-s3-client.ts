import { S3Client } from "@aws-sdk/client-s3";

import * as Party from "partykit/server";

export function getS3Client(room: Party.Room) {
  const s3Client = new S3Client({
    region: "us-east-1",
    endpoint: room.env.R2_ENDPOINT as string,
    credentials: {
      accessKeyId: room.env.R2_ACCESS_KEY as string,
      secretAccessKey: room.env.R2_SECRET_KEY as string,
    },
  });

  return s3Client;
}
