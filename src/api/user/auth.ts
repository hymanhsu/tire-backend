import express, { Express, Request, Response } from "express";

export const authRouter = express.Router();

type AuthRequest = {
    loginName : string;
    password : string;
};

authRouter.post("/login", (req: Request, res: Response) => {
    const authRequest : AuthRequest = req.body;
    res.send("Express + TypeScript Server");
});



