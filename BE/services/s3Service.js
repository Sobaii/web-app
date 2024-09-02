const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function s3UploadFile(bucketName, buffer, mimetype) {
  const params = {
    Bucket: bucketName,
    Key: randomImageName(),
    Body: buffer,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(params));
  return params.Key
}

async function s3GetFileSignedUrl(bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
    expiresIn: 3600,
  });
  return url;
}

async function s3DeleteFile(bucketName, key) {
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };
  const result = await s3Client.send(new DeleteObjectCommand(deleteParams));
  return result;
}

module.exports = { s3UploadFile, s3GetFileSignedUrl, s3DeleteFile };
