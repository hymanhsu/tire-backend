import express, { Express, Request, Response } from "express"
import { create_administrator, create_merchant_owner, create_workshop_manager, create_workshop_staff, query_userinfo } from "@App/service/user_service"
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
    const role = req.loginSession.role;
    const userId = req.loginSession.user_id;
    query_userinfo(userId, role)
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


type CreateUserRequest = {
    nick_name:string, 
    phone_number:string, 
    email:string, 
    login_name:string, 
    password:string
};

userRouter.post("/addAdministrator", checkAuthToken, async (req: Request, res: Response) => {
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
    create_administrator(createUserRequest.nick_name, createUserRequest.phone_number, 
        createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
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

type CreateMerchantUserRequest = {
    merchant_id:string,
    nick_name:string, 
    phone_number:string, 
    email:string, 
    login_name:string, 
    password:string
};

userRouter.post("/addMerchantOwner", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateMerchantUserRequest;
    create_merchant_owner(createUserRequest.merchant_id,createUserRequest.nick_name, createUserRequest.phone_number, 
        createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
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

userRouter.post("/addWorkshopManager", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateMerchantUserRequest;
    create_workshop_manager(createUserRequest.merchant_id, createUserRequest.nick_name, createUserRequest.phone_number, 
        createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
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

userRouter.post("/addWorkshopStaff", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const createUserRequest = req.body as CreateMerchantUserRequest;
    create_workshop_staff(createUserRequest.merchant_id, createUserRequest.nick_name, createUserRequest.phone_number, 
        createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
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
