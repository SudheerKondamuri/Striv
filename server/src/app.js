import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();
import rateLimit from 'express-rate-limit';
import s3Routes from "./api/routes/s3.routes.js";
import authRoutes from './api/routes/auth.routes.js';
import profileRoutes from './api/routes/profile.routes.js';


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.get('/', (req, res) => {
  const id = process.env.DB_USER;
  res.send(`'Hello World! ' ${id}`);
});
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/s3', s3Routes); 

export default app;