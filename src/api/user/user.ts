import express, { Express, Request, Response } from "express"
import { query_userinfo } from "@App/service/user_service"
import { checkAuthToken, LoginSession } from "@App/util/jwtoken"

export const userRouter = express.Router();

userRouter.get("/userinfo", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const userId = (req.loginSession as LoginSession).user_id;
    query_userinfo(userId)
        .then((userInfo) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { ...userInfo }
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: {}
                }
            );
        });
});

