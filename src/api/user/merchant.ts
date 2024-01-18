import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "@App/util/jwtoken"
import { NormalCreateDeleteRequest, ROLES_WITH_AMDIN, allowByRole } from "@App/util/constants";
import { add_merchant, add_workshop, find_all_merchant_owners, find_members_by_merchant, find_merchant_by_id, find_merchants, find_workshops_by_merchant, remove_merchant, remove_workshop } from "@App/dao/merchant_dao";

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
                    data: { id : id}
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

type AddWorkshopRequest = {
    merchant_id: string, 
    workshop_sn: string, 
    workshop_name: string, 
    introduction: string,
    address: string, 
    phone_number: string, 
    latitude: string, 
    longitude: string
};

merchantRouter.post("/addWorkshop", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addWorkshopRequest = req.body as AddWorkshopRequest;
    add_workshop(addWorkshopRequest.merchant_id, addWorkshopRequest.workshop_sn, addWorkshopRequest.workshop_name, addWorkshopRequest.introduction, 
        addWorkshopRequest.address, addWorkshopRequest.phone_number, addWorkshopRequest.latitude, addWorkshopRequest.longitude)
        .then((id) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id : id}
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


merchantRouter.post("/removeWorkshop", checkAuthToken, async (req: Request, res: Response) => {
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
    remove_workshop(normalCreateDeleteRequest.id)
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


type QueryAllWorkshopsRequest = {
    merchant_id: string,
};

merchantRouter.post("/queryAllWorkshops", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const queryAllWorkshopsRequest = req.body as QueryAllWorkshopsRequest;
    find_workshops_by_merchant(queryAllWorkshopsRequest.merchant_id)
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
                    data: {}
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
                    data: {}
                }
            );
        });
});
