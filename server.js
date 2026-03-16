import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);
import express from 'express';
import dotenv from 'dotenv';
import userRouter from "./Router/user.router.js"
import { errorHandler } from "./Middleware/error.middleware.js"
import { dbConnection } from './config/db.js';
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

dbConnection();

app.use("/api/user", userRouter);

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});