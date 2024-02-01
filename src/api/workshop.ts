import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "../util/jwtoken.js";
import { NormalCreateDeleteRequest } from "../util/constants.js";
import {
    add_member_to_workshop, add_workshop, remove_workshop, find_members_by_workshop,
    find_workshop_by_id, find_workshops_by_merchant, remove_member_from_workshop,
} from "../dao/merchant_dao.js";

export const workshopRouter = express.Router();

workshopRouter.post("/queryOneWorkshop", checkAuthToken, async (req: Request, res: Response) => {
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
    find_workshop_by_id(normalCreateDeleteRequest.id)
        .then((workshop) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: workshop
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

workshopRouter.post("/addWorkshop", checkAuthToken, async (req: Request, res: Response) => {
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


workshopRouter.post("/removeWorkshop", checkAuthToken, async (req: Request, res: Response) => {
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

workshopRouter.post("/queryAllWorkshops", checkAuthToken, async (req: Request, res: Response) => {
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


type QueryWorkshopMembersRequest = {
    merchant_id: string,
    workshop_id: string,
};

workshopRouter.post("/queryWorkshopMembers", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const queryWorkshopMembersRequest = req.body as QueryWorkshopMembersRequest;
    find_members_by_workshop(queryWorkshopMembersRequest.merchant_id, queryWorkshopMembersRequest.workshop_id)
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


type AddRemoveWorkshopMemberRequest = {
    merchant_id: string,
    workshop_id: string,
    user_id: string,
    role: string,
};

workshopRouter.post("/addWorkshopMember", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addRemoveWorkshopMemberRequest = req.body as AddRemoveWorkshopMemberRequest;
    add_member_to_workshop(addRemoveWorkshopMemberRequest.merchant_id, addRemoveWorkshopMemberRequest.workshop_id,
        addRemoveWorkshopMemberRequest.user_id, addRemoveWorkshopMemberRequest.role)
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


workshopRouter.post("/removeWorkshopMember", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addRemoveWorkshopMemberRequest = req.body as AddRemoveWorkshopMemberRequest;
    remove_member_from_workshop(addRemoveWorkshopMemberRequest.merchant_id, addRemoveWorkshopMemberRequest.workshop_id,
        addRemoveWorkshopMemberRequest.user_id, addRemoveWorkshopMemberRequest.role)
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

