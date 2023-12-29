import express, { Express, Request, Response } from "express";

export const heloRouter = express.Router();

heloRouter.get("/login", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});



