import jwt, { Secret } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export type LoginSession = {
    id: string;
    user_id: string;
    role_id: string;
    user_agent: string;
    ttl: number;
    exp: number;
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
        return null;
    }
}

declare module "express-serve-static-core" {
    interface Request {
        loginSession: LoginSession | undefined;
    }
}

export async function checkAuthToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        req.loginSession = undefined;
    } else {
        let decoded = verify_token(token);
        if (decoded != null) {
            console.log("------- SETTING loginSession -------");
            req.loginSession = decoded as LoginSession;
        } else {
            req.loginSession = undefined;
        }
    }
    next();
}

