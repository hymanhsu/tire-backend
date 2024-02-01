import express, { Express, Request, Response } from "express"
import {
    create_administrator, create_merchant_owner, create_workshop_manager,
    create_workshop_staff, query_userinfo
} from "../service/user_service.js";
import { checkAuthToken } from "../util/jwtoken.js";
import { NormalCreateDeleteRequest, ROLES_WITH_AMDIN, allowByRole } from "../util/constants.js";
import { find_all_administrators, remove_user } from "../dao/user_dao.js";

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
    nick_name: string,
    phone_number: string,
    email: string,
    login_name: string,
    password: string
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

userRouter.get("/findAllAdministrators", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    find_all_administrators()
        .then((users) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: users
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: []
                }
            );
        });
});

userRouter.post("/deleteUser", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login or token expired!" },
                data: {}
            }
        );
        return;
    }
    const normalCreateDeleteRequest = req.body as NormalCreateDeleteRequest;
    remove_user(normalCreateDeleteRequest.id)
        .then(() => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: {}
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
    merchant_id: string,
    nick_name: string,
    phone_number: string,
    email: string,
    login_name: string,
    password: string
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
    create_merchant_owner(createUserRequest.merchant_id, createUserRequest.nick_name, createUserRequest.phone_number,
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
