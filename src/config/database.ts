import dynamoose from "dynamoose";

// const ddb = new dynamoose.aws.ddb.DynamoDB({
//   region: process.env.DYNAMODB_REGION,
//   endpoint: process.env.DYNAMODB_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.DYNAMODB_ACCESSKEYID || "dummy",
//     secretAccessKey: process.env.DYNAMODB_SECRETACCESSKEY || "dummy",
//   },
// });

const ddb = new dynamoose.aws.ddb.DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
  },
});

dynamoose.aws.ddb.set(ddb);

console.log("📦 Dynamoose configured to use local DynamoDB!");