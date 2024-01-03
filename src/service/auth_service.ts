import { LoginSession, UserInfo, createLoginSession, findUserByLoginName, createUserAndAuth } from "@App/dao/user_dao"
import { CError, FailToVerifyToken } from "@App/util/errcode"
import { ROLE_CUST, get_session_ttl } from "@App/util/constants"
import jwt from "jsonwebtoken"


/**
 * Signup
 * @param userName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 */
export async function signup(loginName:string, phoneNumber:string, email:string, password:string): Promise<string> {
    return createUserAndAuth(
        loginName, loginName, ROLE_CUST, "", phoneNumber, email, "",
        loginName, password, get_session_ttl(ROLE_CUST)
    );
}

/**
 * Login
 * @param loginName 
 * @param password 
 * @param userAgent 
 * @returns  JWT token
 */
export async function login(loginName: string, password: string, userAgent: string): Promise<string> {
    // query user info by login name and password
    return findUserByLoginName(loginName, password)
        .then(async (userInfo: UserInfo) => {
            // console.log("userInfo = " + JSON.stringify(userInfo));
            return createLoginSession(userInfo.id, userInfo.role_id, userAgent, userInfo.session_ttl);
        })
        .then((loginSession: LoginSession) => {
            // console.log("loginSession = " + JSON.stringify(loginSession));
            var token = jwt.sign(
                loginSession,
                process.env.RSA_PRIVATE_KEY || "",
                {
                    algorithm: 'RS256',
                    expiresIn: loginSession.ttl
                });
            return Promise.resolve(token);
        })
        .catch((error: Error) => {
            console.log("error = " + error);
            return Promise.reject(error);
        });
}

/**
 * Verify token
 * @param token 
 * @returns LoginSession
 */
export async function verify_token(token: string): Promise<LoginSession> {
    try {
        const decoded = jwt.verify(
            token,
            process.env.RSA_PUBLIC_KEY || "",
            {
                algorithms: ['RS256'],
            });
        if (decoded == undefined) {
            return Promise.reject(FailToVerifyToken);
        } else {
            return Promise.resolve(decoded as LoginSession);
        }
    } catch (error) {
        console.error("occur error : "+error);
        return Promise.reject(FailToVerifyToken);
    }
}

