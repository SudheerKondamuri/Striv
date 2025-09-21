import { CognitoUserPool } from "amazon-cognito-identity-js";

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
