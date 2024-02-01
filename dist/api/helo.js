import express from "express";
export const heloRouter = express.Router();
heloRouter.get("/hi", (req, res) => {
    res.send("Express + TypeScript Server  at " + new Date());
});
