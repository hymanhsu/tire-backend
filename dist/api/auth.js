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
import { signup, login, check_token, logout, loginAsUser, loginProceedAsUser } from "@App/service/auth_service";
export const authRouter = express.Router();
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signupRequest = req.body;
    signup(signupRequest.login_name, signupRequest.phone_number, signupRequest.email, signupRequest.password)
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
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAgent = req.get("user-agent");
    const loginRequest = req.body;
    login(loginRequest.login_name, loginRequest.password, userAgent)
        .then((loginResult) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { token: loginResult.token, session: loginResult.loginSession }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
authRouter.post("/loginAsUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAgent = req.get("user-agent");
    const loginRequest = req.body;
    loginAsUser(loginRequest.login_name, loginRequest.password, userAgent)
        .then((loginResult) => {
        if (loginResult.roleOptions == undefined) {
            res.json({
                meta: { status: true, message: "ok" },
                data: { token: loginResult.token, session: loginResult.loginSession }
            });
        }
        else {
            res.json({
                meta: { status: true, message: "ok" },
                data: { token: loginResult.token, session: loginResult.loginSession, role_options: loginResult.roleOptions }
            });
        }
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
authRouter.post("/loginProceedAsUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAgent = req.get("user-agent");
    const loginRequest = req.body;
    loginProceedAsUser(loginRequest.token, loginRequest.session, loginRequest.role_options, loginRequest.selected, userAgent)
        .then((loginResult) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { token: loginResult.token, session: loginResult.loginSession }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
authRouter.post("/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkRequest = req.body;
    check_token(checkRequest.token, checkRequest.update)
        .then((verifyResult) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {
                session: verifyResult.loginSession,
                new_token: verifyResult.newToken
            }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
authRouter.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (token == undefined) {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
        return;
    }
    logout(token)
        .then((loginSession) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    });
}));
