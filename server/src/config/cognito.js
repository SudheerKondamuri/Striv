import { CognitoUserPool } from "amazon-cognito-identity-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env"), debug: true });
}

let userPool;

export function getUserPool() {
  if (!userPool) {
    const poolData = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
    };
    if (!poolData.UserPoolId || !poolData.ClientId) {
      console.error("Missing Cognito env vars:", poolData);
      throw new Error("Both UserPoolId and ClientId are required.");
    }
    userPool = new CognitoUserPool(poolData);
  }
  return userPool;
}
