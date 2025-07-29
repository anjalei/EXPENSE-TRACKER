const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: 'ap-south-1', 
  signatureVersion: 'v4'
});

exports.uploadToS3 = (data, filename) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: data,
  
  };

  return s3.upload(params).promise();
};
exports.getDownloadLink = (filename) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Expires: 60 
  };

  return s3.getSignedUrl('getObject', params); 
};
