// npx ts-node src/index.ts

import { cwd } from 'node:process';
import express, { Express, Request, Response } from "express";
import responseTime from 'response-time';
import dotenv from "dotenv";
import cors from 'cors';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import { heloRouter } from '@App/api/helo/helo1';
import { authRouter } from '@App/api/auth';
import { userRouter } from '@App/api/user';
import { merchantRouter } from '@App/api/merchant';
import { workshopRouter } from '@App/api/workshop';
import { categoryRouter } from '@App/api/category';
import { brandRouter } from '@App/api/brand';
import { productAttrRouter } from '@App/api/product_attr';
import { productRouter } from '@App/api/product';


// load .env
let envFile = '.env';
if (process.env.NODE_ENV != undefined) {
    const envName = `${process.env.NODE_ENV}`;
    const env = envName.trim();
    envFile = `.env.${env}`;
}
console.log("envFile=["+envFile+"]");
console.log("cwd="+cwd());
dotenv.config({ path: envFile });

const app: Express = express();

const filterByMorgan = (request: express.Request, response: express.Response):boolean => {
    const skipUris = ["/api/auth/check"];
    const uri = request.baseUrl + request.url;
    for(const item of skipUris){
        if(item == uri){
            return true;
        }
    }
    return false;
}

// using the dependancies
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
if (process.env.NODE_ENV != 'production') {
    morganBody(app, {
        skip: filterByMorgan,
    });
}

// setting routers
app.use("/api/helo", heloRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/merchant", merchantRouter);
app.use("/api/merchant", workshopRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productAttrRouter);
app.use("/api/product", productRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is listening at port ${port} with ${process.env.TZ}`);
});

// Export the Express API (for vercel)
export default app;
