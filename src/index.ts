// npx ts-node src/index.ts

import express, { Express, Request, Response } from "express";
import responseTime from 'response-time';
import dotenv from "dotenv";
import cors from 'cors';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import { heloRouter } from '@App/api/helo/helo1';
import { authRouter } from '@App/api/user/auth';

// load .env
dotenv.config();

const app: Express = express();

// using the dependancies
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
if (process.env.NODE_ENV != 'production') {
    morganBody(app);
}

// setting routers
app.use("/api/helo", heloRouter);
app.use("/api/auth", authRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port} with ${process.env.TZ}`);
});

