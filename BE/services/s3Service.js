const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require('uuid');


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(bucketName, buffer) {
  const fileKey = uuidv4();
  const uploadParams = {
    Bucket: bucketName,
    Key: fileKey,
    Body: buffer,
    ServerSideEncryption: "AES256",
    ContentDisposition: "inline",
    ContentType: "image/jpeg",
  };

  try {
    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    return {result, fileKey};
  } catch (err) {
    console.error(err);
    throw new Error("Error uploading file to S3");
  }
}

async function readFileFromS3(bucketName, fileName) {
  
  const downloadParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(downloadParams));
    return data.Body; 
  } catch (err) {
    console.error(err);
    throw new Error("Error downloading file from S3");
  }
}

module.exports = { uploadFileToS3, readFileFromS3 };
