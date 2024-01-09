import express, { Express, Request, Response } from "express"
import { signup, login, check_token, logout, LoginResult } from "@App/service/auth_service"

export const authRouter = express.Router();

type SignupRequest = {
    login_name: string;
    phone_number: string;
    email: string;
    password: string;
};

authRouter.post("/signup", async (req: Request, res: Response) => {
    const signupRequest = req.body as SignupRequest;
    signup(signupRequest.login_name, signupRequest.phone_number, signupRequest.email, signupRequest.password)
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

type LoginRequest = {
    login_name: string;
    password: string;
};

authRouter.post("/login", async (req: Request, res: Response) => {
    const userAgent = req.get("user-agent") as string;
    const loginRequest = req.body as LoginRequest;
    login(loginRequest.login_name, loginRequest.password, userAgent)
        .then((loginResult: LoginResult) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { token: loginResult.token, session: loginResult.loginSession }
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

type CheckRequest = {
    token: string;
    update: boolean;
};

authRouter.post("/check", async (req: Request, res: Response) => {
    const checkRequest = req.body as CheckRequest;
    check_token(checkRequest.token, checkRequest.update)
        .then((verifyResult) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: {
                        session: verifyResult.loginSession,
                        newToken: verifyResult.newToken
                    }
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

authRouter.get("/logout", async (req: Request, res: Response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token == undefined) {
        res.json(
            {
                meta: { status: true, message: "ok" },
                data: {}
            }
        );
        return;
    }
    logout(token)
        .then((loginSession) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: {}
                }
            );
        });
});

