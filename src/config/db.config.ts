import * as Dynamoose from "dynamoose";
import env from "./env.config";

const {
  NODE_ENV,
  STAGING_AWS_ACCESS_KEY_ID,
  STAGING_AWS_SECRET_ACCESS_KEY,
  STAGING_AWS_REGION,
  PROD_AWS_ACCESS_KEY_ID,
  PROD_AWS_SECRET_ACCESS_KEY,
  PROD_AWS_REGION,
} = env;

const connection = async () => {
  try {
    console.log(NODE_ENV);
    switch (NODE_ENV) {
      case "development": {
        Dynamoose.aws.ddb.local();
        break;
      }
      case "staging": {
        const ddb = new Dynamoose.aws.ddb.DynamoDB({
          credentials: {
            accessKeyId: STAGING_AWS_ACCESS_KEY_ID,
            secretAccessKey: STAGING_AWS_SECRET_ACCESS_KEY,
          },
          region: STAGING_AWS_REGION,
        });
        if (!ddb) {
          console.log("DB Connection did not succeed");
          process.exit(1);
        }
        Dynamoose.aws.ddb.set(ddb);
        break;
      }
      case "production": {
        const ddb = new Dynamoose.aws.ddb.DynamoDB({
          credentials: {
            accessKeyId: PROD_AWS_ACCESS_KEY_ID,
            secretAccessKey: PROD_AWS_SECRET_ACCESS_KEY,
          },
          region: PROD_AWS_REGION,
        });
        if (!ddb) {
          console.log("DB Connection did not succeed");
          process.exit(1);
        }
        Dynamoose.aws.ddb.set(ddb);
        break;
      }
      default:
        console.log("Environment not defined");
        process.exit(1);
    }
    console.log(`Connected to DynamoDB in ${NODE_ENV} mode`);
  } catch (error) {
    return error;
  }
};

export { connection };
