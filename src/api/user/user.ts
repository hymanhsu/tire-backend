import express, { Express, Request, Response } from "express"
import { create_administrator, create_merchant_owner, create_workshop_manager, create_workshop_staff, query_userinfo, query_userinfos_by_role } from "@App/service/user_service"
import { checkAuthToken, LoginSession } from "@App/util/jwtoken"
import { ROLES_WITH_AMDIN, allowByRole } from "@App/util/constants";

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

userRouter.get("/findUsersByRole", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const role = (req.loginSession as LoginSession).role_id;
    const allow = allowByRole(role, ROLES_WITH_AMDIN);
    if (!allow){
        res.json(
            {
                meta: { status: false, message: "You are not allowed!" },
                data: {}
            }
        );
        return;
    }
    const roleNeed = req.query.role as string;
    query_userinfos_by_role(roleNeed)
        .then((userInfos) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: userInfos
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

type CreateUserRequest = {
    userName:string, 
    nickName:string, 
    phoneNumber:string, 
    email:string, 
    loginName:string, 
    password:string
};

userRouter.post("/createAdministrator", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateUserRequest;
    create_administrator(createUserRequest.userName, createUserRequest.nickName, createUserRequest.phoneNumber, 
        createUserRequest.email, createUserRequest.loginName, createUserRequest.password)
        .then((userId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { user_id: userId }
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

userRouter.post("/createMerchantOwner", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateUserRequest;
    create_merchant_owner(createUserRequest.userName, createUserRequest.nickName, createUserRequest.phoneNumber, 
        createUserRequest.email, createUserRequest.loginName, createUserRequest.password)
        .then((userId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { user_id: userId }
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

userRouter.post("/createWorkshopManager", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateUserRequest;
    create_workshop_manager(createUserRequest.userName, createUserRequest.nickName, createUserRequest.phoneNumber, 
        createUserRequest.email, createUserRequest.loginName, createUserRequest.password)
        .then((userId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { user_id: userId }
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

userRouter.post("/createWorkshopStaff", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateUserRequest;
    create_workshop_staff(createUserRequest.userName, createUserRequest.nickName, createUserRequest.phoneNumber, 
        createUserRequest.email, createUserRequest.loginName, createUserRequest.password)
        .then((userId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { user_id: userId }
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
