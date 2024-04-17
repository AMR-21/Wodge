import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import path from "path";
import { prettyJSON } from "hono/pretty-json";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "hono/adapter";
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListBucketsCommand,
  HeadObjectCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { serveStatic } from "hono/cloudflare-workers";
//@ts-ignore
import manifest from "__STATIC_CONTENT_MANIFEST";
const app = new Hono({ strict: false });
app.use(prettyJSON());
const api_bucket = app.basePath("/bucket");
const api_object = app.basePath("/object");

/**
 * @type {S3Client}
 */
let s3Client: S3Client;

const expiresIn = 900;
app.use("*", async (c, next) => {
  const { ENDPOINT } = env<{ ENDPOINT: string }>(c);
  const { ACCESS_KEY } = env<{ ACCESS_KEY: string }>(c);
  const { SECRET_KEY } = env<{ SECRET_KEY: string }>(c);
  s3Client ??= new S3Client({
    region: "us-east-1",
    endpoint: ENDPOINT,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });
  await next();
});

app.use("/static/*", serveStatic({ root: "./", manifest }));
app.use("/favicon.ico", serveStatic({ path: "./favicon.ico", manifest }));
app.get("/", serveStatic({ manifest, path: "/drag.html" }));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(`${err}`);
  if (c.res.status === 404) {
    return c.html("Not-Found", 404);
  } else return c.html("Internal Server Error", 500);
});

app.post("/auth", async (c, next) => {
  let authorized = true;
  if (!authorized) {
    throw new HTTPException(401, { message: "Not-Authorized" });
  }
  await next();
});

// CREATE A BUCKET IN THE ACCOUNT USED FOR CREATING A NEW TEAM IN THE APP
api_bucket.post("/create/:bucket-name", async (c) => {
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

// GET LIST OF ALL BUCKETS IN THE ACCOUNT USED FOR TESTING

api_bucket.get("/list", async (c) => {
  const command = new ListBucketsCommand({});
  const response = await s3Client.send(command);
  return c.json(response, 200);
});

// USED TO DELETE A WHOLE TEAM BE CAREFUL WHEN USING
// TODO
api_bucket.post("/delete/:bucket-name", async (c) => {
  try {
    const bucketName = c.req.param("bucket-name");
    const input = {
      Bucket: bucketName,
    };

    const command = new DeleteBucketCommand(input);
    const response = await s3Client.send(command);
    return c.json(response, 200);
  } catch (error) {
    console.log(error);
    return c.json(error, 400);
  }
});

api_object.post("/put/:bucket/:key", async (c) => {
  console.log(c.req);
  const bucket = c.req.param("bucket");

  const key = atob(c.req.param("key"));

  const [_, file] = key.split("/");
  const file_extension = path.extname(file) || ".jpg";

  var body: string | ArrayBuffer;
  var content_type;
  try {
    if ([".txt", ".js", ".html", ".css", ".json"].includes(file_extension)) {
      body = await c.req.text();
      body = body.toString();
      content_type = "text/plain";
    } else if (
      [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".pdf"].includes(file_extension)
    ) {
      body = await c.req.arrayBuffer();
      content_type = "application/octet-stream";
    } else {
      return c.json({ message: "Invalid file type" }, 400);
    }
    const input = {
      Body: body! as string,
      Bucket: bucket!,
      Key: key!,
      ContentType: content_type,
    };
    const command = new PutObjectCommand(input);
    const response = await s3Client.send(command);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn,
    });
    return c.json({ signedUrl, response }, 200);
  } catch (error) {
    console.log(error);
    return c.json(error, 400);
  }
});
// Delete a file from a bucket
api_object.post("/delete/:bucket/:key", async (c) => {
  const bucket = c.req.param("bucket");
  let key = atob(c.req.param("key"));
  const checkfile = await getSignedUrl(
    s3Client,
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
  let checkfileResponse = await fetch(checkfile, {
    method: "HEAD",
  });
  if (checkfileResponse.statusText === "Not Found") {
    return c.json({ message: "File does not exist" }, 400);
  } else {
    const deleteurl = await getSignedUrl(
      s3Client,
      new DeleteObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 3600 }
    );
    let response = await fetch(deleteurl, {
      method: "DELETE",
    });
    if (response.status === 204) {
      return c.json({ message: "File deleted successfully" }, 200);
    } else {
      return c.json({ message: "File not deleted" }, 400);
    }
  }
});

// Download a file from a bucket
api_object.get("/download/:bucket/:key", async (c) => {
  const bucket = c.req.param("bucket");
  let key = atob(c.req.param("key"));
  const checkfile = await getSignedUrl(
    s3Client,
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
  let checkfileResponse = await fetch(checkfile, {
    method: "HEAD",
  });
  if (checkfileResponse.statusText === "Not Found") {
    return c.json({ message: "File does not exist" }, 400);
  } else {
    const downloadurl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 3600 }
    );
    return c.json({ downloadurl }, 200);
  }
});

// check file in bucket
api_object.get("/check/:bucket/:key", async (c) => {
  const bucket = c.req.param("bucket");
  let key = atob(c.req.param("key"));
  const checkfile = await getSignedUrl(
    s3Client,
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
  let checkfileResponse = await fetch(checkfile, {
    method: "HEAD",
  });
  if (checkfileResponse.statusText === "Not Found") {
    return c.json({ message: "File does not exist" }, 400);
  } else {
    return c.json({ message: "File exists" }, 200);
  }
});

//list all files in a bucket in a path in recusive mode
api_object.get("/list/:bucket/:path?", async (c) => {
  const bucket = c.req.param("bucket");
  let path = c.req.param("path") as string;
  if (path === undefined) {
    path = "";
  }
  path = path.replace(/\+47%\+/g, "/").replace(/\+46%\+/g, ".");
  const input = {
    Bucket: bucket!,
    Prefix: path!,
  };
  const command = new ListObjectsV2Command(input);
  const response = await s3Client.send(command);
  const keys = response.Contents?.map((content) => content.Key);
  return c.json(keys, 200);
});

// copy a file from location to another location
api_object.post("/copy/:source/:dest/:key", async (c) => {
  const source = c.req.param("source");
  const dest = c.req.param("dest");
  let key = c.req.param("key");
  key = key.replace(/\+47%\+/g, "/").replace(/\+46%\+/g, ".");
  const command = new ListBucketsCommand({});
  const response = await s3Client.send(command);
  var bucketnames = response.Buckets?.map((bucket: any) => bucket.Name);
  if (!bucketnames?.includes(source) || !bucketnames?.includes(dest)) {
    return c.json({ message: "One of the buckets does not exist" }, 400);
  } else {
    const checkfile = await getSignedUrl(
      s3Client,
      new HeadObjectCommand({ Bucket: source, Key: key }),
      { expiresIn: 3600 }
    );
    let checkfileResponse = await fetch(checkfile, {
      method: "HEAD",
    });
    if (checkfileResponse.statusText === "Not Found") {
      return c.json({ message: "File does not exist" }, 400);
    } else {
      const copyurl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({ Bucket: dest, Key: key }),
        { expiresIn: 3600 }
      );
      let response = await fetch(copyurl, {
        method: "PUT",
      });
      if (response.status === 200) {
        return c.json({ message: "File copied successfully" }, 200);
      } else {
        return c.json({ message: "File not copied" }, 400);
      }
    }
  }
});
app.all("*", async (c, next) => {
  return c.newResponse(null, { status: 501 });
});
export default app;
