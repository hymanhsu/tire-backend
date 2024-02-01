var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { checkAuthToken } from "../util/jwtoken.js";
import { add_member_to_workshop, add_workshop, remove_workshop, find_members_by_workshop, find_workshop_by_id, find_workshops_by_merchant, remove_member_from_workshop, } from "../dao/merchant_dao.js";
export const workshopRouter = express.Router();
workshopRouter.post("/queryOneWorkshop", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    find_workshop_by_id(normalCreateDeleteRequest.id)
        .then((workshop) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: workshop
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
workshopRouter.post("/addWorkshop", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addWorkshopRequest = req.body;
    add_workshop(addWorkshopRequest.merchant_id, addWorkshopRequest.workshop_sn, addWorkshopRequest.workshop_name, addWorkshopRequest.introduction, addWorkshopRequest.address, addWorkshopRequest.phone_number, addWorkshopRequest.latitude, addWorkshopRequest.longitude)
        .then((id) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { id: id }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
workshopRouter.post("/removeWorkshop", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_workshop(normalCreateDeleteRequest.id)
        .then(() => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
workshopRouter.post("/queryAllWorkshops", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const queryAllWorkshopsRequest = req.body;
    find_workshops_by_merchant(queryAllWorkshopsRequest.merchant_id)
        .then((list) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: list
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
workshopRouter.post("/queryWorkshopMembers", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const queryWorkshopMembersRequest = req.body;
    find_members_by_workshop(queryWorkshopMembersRequest.merchant_id, queryWorkshopMembersRequest.workshop_id)
        .then((users) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: users
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
workshopRouter.post("/addWorkshopMember", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addRemoveWorkshopMemberRequest = req.body;
    add_member_to_workshop(addRemoveWorkshopMemberRequest.merchant_id, addRemoveWorkshopMemberRequest.workshop_id, addRemoveWorkshopMemberRequest.user_id, addRemoveWorkshopMemberRequest.role)
        .then(() => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
workshopRouter.post("/removeWorkshopMember", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addRemoveWorkshopMemberRequest = req.body;
    remove_member_from_workshop(addRemoveWorkshopMemberRequest.merchant_id, addRemoveWorkshopMemberRequest.workshop_id, addRemoveWorkshopMemberRequest.user_id, addRemoveWorkshopMemberRequest.role)
        .then(() => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
