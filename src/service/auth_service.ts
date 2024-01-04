import { LoginSession, UserInfo, createLoginSession, updateLoginSession, findUserByLoginName, createUserAndAuth, invalidateLoginSession } from "@App/dao/user_dao"
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
export async function signup(loginName: string, phoneNumber: string, email: string, password: string): Promise<string> {
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
                {
                    ...loginSession,
                    exp: Math.floor(Date.now() / 1000) + loginSession.ttl,
                },
                process.env.RSA_PRIVATE_KEY || "",
                {
                    algorithm: 'RS256',
                    // expiresIn: loginSession.ttl
                });
            return Promise.resolve(token);
        })
        .catch((error: Error) => {
            console.log("error = " + error);
            return Promise.reject(error);
        });
}

export type VerifyResult = {
    loginSession: LoginSession;
    newToken: string;
};

/**
 * Verify token
 * @param token 
 * @param update : update token forcely
 * @returns LoginSession
 */
export async function verify_token(token: string, update: boolean): Promise<VerifyResult> {
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
            const loginSession = decoded as LoginSession;
            if (update) {
                updateLoginSession(loginSession.id);
                var newToken = jwt.sign(
                    {
                        ...loginSession,
                        exp: Math.floor(Date.now() / 1000) + loginSession.ttl,
                    },
                    process.env.RSA_PRIVATE_KEY || "",
                    {
                        algorithm: 'RS256',
                        // expiresIn: loginSession.ttl
                    });
                return Promise.resolve({
                    loginSession: loginSession,
                    newToken: newToken
                });
            }else{
                // check expire time if near (<10min)
                const left_ttl = Math.floor(loginSession.exp - Date.now()/1000);
                console.log(`user [${loginSession.user_id}] remain ttl : ${left_ttl} s`);
                if (left_ttl < 10 * 60 ) {
                    updateLoginSession(loginSession.id);
                    var newToken = jwt.sign(
                        {
                            ...loginSession,
                            exp: Math.floor(Date.now() / 1000) + loginSession.ttl,
                        },
                        process.env.RSA_PRIVATE_KEY || "",
                        {
                            algorithm: 'RS256',
                            // expiresIn: loginSession.ttl
                        });
                    return Promise.resolve({
                        loginSession: loginSession,
                        newToken: newToken
                    });
                }else{
                    return Promise.resolve({
                        loginSession: loginSession,
                        newToken: ""
                    });
                }
            }
        }
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.reject(FailToVerifyToken);
    }
}

/**
 * Logout
 * @param token 
 * @returns 
 */
export async function logout(token: string): Promise<void> {
    try {
        const decoded = jwt.verify(
            token,
            process.env.RSA_PUBLIC_KEY || "",
            {
                algorithms: ['RS256'],
                ignoreExpiration: true,
            }) as LoginSession;
        const sessionId = decoded.id;
        invalidateLoginSession(sessionId);
        return Promise.resolve();
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.resolve();
    }
}
