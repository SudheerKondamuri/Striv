import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import prisma from './src/prisma/client.js';
const port = process.env.PORT || 3000
const server = http.createServer(app);

const testDBConnection = async () => {
  try{
   // await prisma.$connect();
   // const users = await prisma.user.findMany();
    console.log("Database connection successful. Number of users:", users.length);
  }
  catch(err){
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }
};

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // testDBConnection();
});



