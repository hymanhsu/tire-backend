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
import { add_merchant, find_all_merchant_owners, remove_merchant, find_members_by_merchant, find_merchant_by_id, find_merchants, } from "../dao/merchant_dao.js";
export const merchantRouter = express.Router();
merchantRouter.post("/add", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addMerchantRequest = req.body;
    add_merchant(addMerchantRequest.nation, addMerchantRequest.province, addMerchantRequest.city, addMerchantRequest.merchant_sn, addMerchantRequest.merchant_name, addMerchantRequest.introduction, addMerchantRequest.website_url, addMerchantRequest.address, addMerchantRequest.phone_number)
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
merchantRouter.post("/remove", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_merchant(normalCreateDeleteRequest.id)
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
merchantRouter.post("/queryOne", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    find_merchant_by_id(normalCreateDeleteRequest.id)
        .then((merchant) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: merchant
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
merchantRouter.get("/queryAll", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    find_merchants()
        .then((list) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: list
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
merchantRouter.post("/queryAllOwners", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    find_all_merchant_owners(normalCreateDeleteRequest.id)
        .then((list) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: list
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
merchantRouter.post("/queryMembers", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const queryMembersRequest = req.body;
    find_members_by_merchant(queryMembersRequest.merchant_id)
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
