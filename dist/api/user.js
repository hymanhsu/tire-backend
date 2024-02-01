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
import { create_administrator, create_merchant_owner, create_workshop_manager, create_workshop_staff, query_userinfo } from "../service/user_service.js";
import { checkAuthToken } from "../util/jwtoken.js";
import { find_all_administrators, remove_user } from "../dao/user_dao.js";
export const userRouter = express.Router();
userRouter.get("/userinfo", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const role = req.loginSession.role;
    const userId = req.loginSession.user_id;
    query_userinfo(userId, role)
        .then((userInfo) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: Object.assign({}, userInfo)
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
userRouter.post("/addAdministrator", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login or token expired!" },
            data: {}
        });
        return;
    }
    const createUserRequest = req.body;
    create_administrator(createUserRequest.nick_name, createUserRequest.phone_number, createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
        .then((userId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { user_id: userId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
userRouter.get("/findAllAdministrators", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login or token expired!" },
            data: {}
        });
        return;
    }
    find_all_administrators()
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
userRouter.post("/deleteUser", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login or token expired!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_user(normalCreateDeleteRequest.id)
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
userRouter.post("/addMerchantOwner", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login or token expired!" },
            data: {}
        });
        return;
    }
    const createUserRequest = req.body;
    create_merchant_owner(createUserRequest.merchant_id, createUserRequest.nick_name, createUserRequest.phone_number, createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
        .then((userId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { user_id: userId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
userRouter.post("/addWorkshopManager", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login or token expired!" },
            data: {}
        });
        return;
    }
    const createUserRequest = req.body;
    create_workshop_manager(createUserRequest.merchant_id, createUserRequest.nick_name, createUserRequest.phone_number, createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
        .then((userId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { user_id: userId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
userRouter.post("/addWorkshopStaff", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login or token expired!" },
            data: {}
        });
        return;
    }
    const createUserRequest = req.body;
    create_workshop_staff(createUserRequest.merchant_id, createUserRequest.nick_name, createUserRequest.phone_number, createUserRequest.email, createUserRequest.login_name, createUserRequest.password)
        .then((userId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { user_id: userId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
