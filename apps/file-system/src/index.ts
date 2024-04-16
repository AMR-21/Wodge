import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import https from "https";
import path from "path";
import crypto from "crypto";
import { prettyJSON } from "hono/pretty-json";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  CreateBucketCommand,
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  ListPartsCommand,
  PutObjectCommand,
  ListBucketsCommand,
  UploadPartCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { STSClient, GetFederationTokenCommand } from "@aws-sdk/client-sts";
import { serveStatic } from "hono/cloudflare-workers";
import manifest from "__STATIC_CONTENT_MANIFEST";

const CLOUDFLARE_ENDPOINT =
  "https://api.cloudflare.com/client/v4/accounts/93105e614cae9d4ce611e47275791dec/r2/buckets";
const TOKEN = "ieHJkdSjDq0qh_Fl3SOIjVg7kFWkdGdK7yWQaQaH";
const app = new Hono();
app.use(prettyJSON());
const api = app.basePath("/bucket");

type Bindings = {
  MY_BUCKET: R2Bucket;
  USERNAME: string;
  PASSWORD: string;
};

/**
 * @type {S3Client}
 */
let s3Client: S3Client;

const expiresIn = 900;

s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "https://93105e614cae9d4ce611e47275791dec.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "c7cfddc3ab1bc35ad5fb98b66a0b5023",
    secretAccessKey:
      "4af3fde0df07d054f0eb45a0801584768973a98170f65f9405200dbe9676fd71",
  },
});

app.post("/auth", async (c, next) => {
  let authorized = true;
  if (!authorized) {
    throw new HTTPException(401, { message: "Not-Authorized" });
  }
  await next();
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(`${err}`);
  if (c.res.status === 404) {
    return c.html("Not-Found", 404);
  } else return c.html("Internal Server Error", 500);
});

app.get("/*", serveStatic({ root: "./", manifest }));

api.get("/", (c) => {
  return c.html("HOME", 200);
});

api.post("/create/:bucket-name", async (c) => {
  try {
    const bucketname = c.req.param("bucket-name");
    const input = {
      Bucket: bucketname!,
    };
    const command = new CreateBucketCommand(input);
    const response = await s3Client.send(command);
    return c.json(response, 200);
  } catch (error) {
    console.log(error);
    return c.json(error, 400);
  }
});

api.get("/list", async (c) => {
  const command = new ListBucketsCommand({});
  const response = await s3Client.send(command);
  return c.json(response, 200);
});

api.post("/delete/:path", async (c) => {
  const path = c.req.param("path");
  const input = {
    Bucket: path,
  };
  const command = new DeleteBucketCommand(input);
  const response = await s3Client.send(command);
  return c.json(response, 200);
});

api.post("/put/:path/sign-s3", async (c) => {
  const path = c.req.param("path");
  const Key = `${crypto.randomUUID()}-${await c.req.parseBody()}`;
  const contentType = c.req.json();
  try {
    const input = {
      Body: "HappyFace.jpg",
      Bucket: "examplebucket",
      Key: "HappyFace.jpg",
    };
    const command = new PutObjectCommand(input);
    getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: path,
        Key,
        ContentType: contentType,
      })
    );

    const response = await s3Client.send(command);
  } catch (error) {
    console.log(error);
    return c.json(error, 400);
  }
});

export default app;
