import dynamoose from "dynamoose";

const ddb = new dynamoose.aws.ddb.DynamoDB({
    region: process.env.DYNAMODB_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
        accessKeyId: process.env.DYNAMODB_ACCESSKEYID || "",
        secretAccessKey: process.env.DYNAMODB_SECRETACCESSKEY || "",
    },
});

dynamoose.aws.ddb.set(ddb);

console.log("📦 Dynamoose configured to use DynamoDB!");
