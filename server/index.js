import dotenv from 'dotenv';
dotenv.config();
console.log('COGNITO_USER_POOL_ID:', process.env.COGNITO_USER_POOL_ID);
console.log('COGNITO_CLIENT_ID:', process.env.COGNITO_CLIENT_ID);
import http from 'http';
import app from './src/app.js';
const port = process.env.PORT || 3000 
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



