import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "../util/jwtoken.js";
import { NormalCreateDeleteRequest } from "../util/constants.js";
import {
    add_merchant, find_all_merchant_owners, remove_merchant,
    find_members_by_merchant, find_merchant_by_id, find_merchants,
} from "../dao/merchant_dao.js";

export const merchantRouter = express.Router();

type AddMerchantRequest = {
    nation: string
    province: string
    city: string
    merchant_sn: string
    merchant_name: string
    introduction: string
    website_url: string
    address: string
    phone_number: string
};

merchantRouter.post("/add", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addMerchantRequest = req.body as AddMerchantRequest;
    add_merchant(addMerchantRequest.nation, addMerchantRequest.province, addMerchantRequest.city, addMerchantRequest.merchant_sn, addMerchantRequest.merchant_name,
        addMerchantRequest.introduction, addMerchantRequest.website_url, addMerchantRequest.address, addMerchantRequest.phone_number)
        .then((id) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id: id }
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


merchantRouter.post("/remove", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const normalCreateDeleteRequest = req.body as NormalCreateDeleteRequest;
    remove_merchant(normalCreateDeleteRequest.id)
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


merchantRouter.post("/queryOne", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const normalCreateDeleteRequest = req.body as NormalCreateDeleteRequest;
    find_merchant_by_id(normalCreateDeleteRequest.id)
        .then((merchant) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: merchant
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


merchantRouter.get("/queryAll", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    find_merchants()
        .then((list) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: list
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


merchantRouter.post("/queryAllOwners", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const normalCreateDeleteRequest = req.body as NormalCreateDeleteRequest;
    find_all_merchant_owners(normalCreateDeleteRequest.id)
        .then((list) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: list
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


type QueryMembersRequest = {
    merchant_id: string
};

merchantRouter.post("/queryMembers", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const queryMembersRequest = req.body as QueryMembersRequest;
    find_members_by_merchant(queryMembersRequest.merchant_id)
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


