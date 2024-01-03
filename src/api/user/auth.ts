import express, { Express, Request, Response } from "express"
import { signup, login, verify_token, logout } from "@App/service/auth_service"

export const authRouter = express.Router();

type SignupRequest = {
    loginName : string;
    phoneNumber : string;
    email: string;
    password : string;
};

authRouter.post("/signup", async (req: Request, res: Response) => {
    const signupRequest = req.body as SignupRequest;
    signup(signupRequest.loginName, signupRequest.phoneNumber, signupRequest.email, signupRequest.password)
    .then((userId) => {
        res.json(
            {
                meta: {status:true, message: "ok"},
                data: {user_id: userId}
            }
        );
    })
    .catch((err) => {
        res.json(
            {
                meta: {status:false, message: err.message},
                data: {}
            }
        );
    });
});

type LoginRequest = {
    loginName : string;
    password : string;
};

authRouter.post("/login", async (req: Request, res: Response) => {
    const userAgent = req.get("user-agent") as string;
    const loginRequest = req.body as LoginRequest;
    login(loginRequest.loginName, loginRequest.password, userAgent)
    .then((token) => {
        res.json(
            {
                meta: {status:true, message: "ok"},
                data: {token: token}
            }
        );
    })
    .catch((err) => {
        res.json(
            {
                meta: {status:false, message: err.message},
                data: {}
            }
        );
    });
});

type CheckRequest = {
    token : string;
    update : boolean;
};

authRouter.post("/check", async (req: Request, res: Response) => {
    const checkRequest = req.body as CheckRequest;
    verify_token(checkRequest.token, checkRequest.update)
    .then((verifyResult) => {
        res.json(
            {
                meta: {status:true, message: "ok"},
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
                meta: {status:false, message: err.message},
                data: {}
            }
        );
    });
});

authRouter.post("/logout", async (req: Request, res: Response) => {
    const checkRequest = req.body as CheckRequest;
    logout(checkRequest.token)
    .then((loginSession) => {
        res.json(
            {
                meta: {status:true, message: "ok"},
                data: {}
            }
        );
    });
});

