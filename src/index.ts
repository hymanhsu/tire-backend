// npx ts-node src/index.ts

import { cwd } from 'process';
import express, { Express, Request, Response } from "express";
import responseTime from 'response-time';
import dotenv from "dotenv";
import cors from 'cors';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import { heloRouter } from './api/helo.js';
import { authRouter } from './api/auth.js';
import { userRouter } from './api/user.js';
import { merchantRouter } from './api/merchant.js';
import { workshopRouter } from './api/workshop.js';
import { categoryRouter } from './api/category.js';
import { brandRouter } from './api/brand.js';
import { productAttrRouter } from './api/product_attr.js';
import { productRouter } from './api/product.js';


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
console.log(process.env);

const app = express();
const port = process.env.PORT || 3000;

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

// set middlewares
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

// set routers
app.use("/", heloRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/merchant", merchantRouter);
app.use("/api/merchant", workshopRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productAttrRouter);
app.use("/api/product", productRouter);

app.listen(port, () => {
    console.log(`[server]: Server is listening on ${port} with ${process.env.TZ}`);
});

// Export the Express API (for vercel)
export default app;
