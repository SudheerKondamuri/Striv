import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force dotenv to load the .env in the same folder as this file
dotenv.config({ path: path.resolve(__dirname, ".env"), debug: true });

console.log("CWD:", process.cwd());
console.log("ENV LOADED FROM:", path.resolve(__dirname, ".env"));
console.log("COGNITO_USER_POOL_ID =", process.env.COGNITO_USER_POOL_ID);
console.log("COGNITO_CLIENT_ID =", process.env.COGNITO_CLIENT_ID);
