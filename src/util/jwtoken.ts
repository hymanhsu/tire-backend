import jwt, { Secret } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export type RoleOption = {
    role: string;
    merchant_id: string;
    merchant_name: string;
    workshop_id: string; // maybe empty
};

export type LoginSession = {
    id: string;
    user_id: string;
    role: string; // maybe empty
    ttl: number;
    exp: number;
    role_option?: RoleOption;
};

// export const SECRET_KEY: Secret = 'your-secret-key-here';

/**
 * Generate token
 * @param ttl 
 * @param payload 
 * @returns 
 */
export function generate_token(payload: LoginSession, ttl: number): string {
    var token = jwt.sign(
        {
            ...payload,
            exp: Math.floor(Date.now() / 1000) + ttl,
        },
        process.env.RSA_PRIVATE_KEY || "",
        {
            algorithm: 'RS256',
        });
    return token;
}

/**
 * Vefify the token
 * @param token 
 * @param ignoreExpiration 
 * @returns 
 */
export function verify_token(token: string, ignoreExpiration: boolean = false): LoginSession | null {
    try {
        const decoded = jwt.verify(
            token,
            process.env.RSA_PUBLIC_KEY || "",
            {
                algorithms: ['RS256'],
                ignoreExpiration: ignoreExpiration,
            });
        if (decoded == undefined || decoded == null) {
            return null;
        }
        return decoded as LoginSession;
    } catch (error) {
        console.log(token);
        console.log(error);
        return null;
    }
}

/**
 * Extend the type 'Request' in the Express
 */
declare module "express-serve-static-core" {
    interface Request {
        loginSession: LoginSession | undefined;
    }
}

/**
 * Check the token and add the login session into request if need
 * @param req 
 * @param res 
 * @param next 
 */
export async function checkAuthToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        // console.log("------- NOT FOUND TOKEN -------");
        req.loginSession = undefined;
    } else {
        let decoded = verify_token(token);
        if (decoded != null) {
            // console.log("------- SETTING loginSession -------");
            req.loginSession = decoded as LoginSession;
        } else {
            // console.log("------- INVALID TOKEN -------");
            req.loginSession = undefined;
        }
    }
    next();
}

