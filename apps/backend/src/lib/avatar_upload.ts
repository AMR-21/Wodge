import AWS from "aws-sdk";
import fs from "fs";


const s3 = new AWS.S3();

async function uploadPhotoToS3(
  bucketName: string,
  photoKey: string,
  photoData: Buffer
): Promise<void> {
  const params = {
    Bucket: bucketName,
    Key: photoKey, // key is the path in the bucket where the photo will be stored in case user avatar use the following format in forming the key `user-avatars/${userId}/${photoName}`
    Body: photoData,
  };

  await s3.upload(params).promise();
}

function readFileAsync(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(Buffer.from(data));
      }
    });
  });
}

const bucketName = "get bucket name from infisical";
const photoKey = "path/to/photo.jpg";

readFileAsync(photoKey)
  .then(async (photoData) => {
    try {
      await uploadPhotoToS3(bucketName, photoKey, photoData);
      console.log("Photo uploaded successfully");
    } catch (error) {
      console.error("Failed to upload photo:", error);
    }
  })
  .catch((error) => {
    console.error("Failed to read photo file:", error);
  });
