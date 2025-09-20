import express from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();
import dotenv from "dotenv";

import authRoutes from './api/routes/auth.routes.js';
import profileRoutes from './api/routes/profile.routes.js';

dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get('/', (req, res) => {
  const id = process.env.DB_USER;
  res.send(`'Hello World! ' ${id}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

export default app;