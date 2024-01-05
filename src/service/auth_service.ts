import { UserInfo, createLoginSession, updateLoginSession, findUserByLoginName, createUserAndAuth, invalidateLoginSession, UserTtl } from "@App/dao/user_dao"
import { CError, FailToVerifyToken } from "@App/util/errcode"
import { ROLE_CUST, get_session_ttl } from "@App/util/constants"
import { generate_token, verify_token, LoginSession } from "@App/util/jwtoken";

/**
 * Signup (as customer)
 * @param userName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 */
export async function signup(loginName: string, phoneNumber: string, email: string, password: string): Promise<string> {
    const userWithAuth = {
        userName: loginName,
        nickName: loginName,
        roleId: ROLE_CUST,
        address: "",
        phoneNumber: phoneNumber,
        email: email,
        photoUrl: "",
        loginName: loginName,
        password: password,
        sessionTtl: get_session_ttl(ROLE_CUST),
    };    
    return createUserAndAuth(userWithAuth);
}

export type LoginResult = {
    loginSession: LoginSession;
    token: string;
};

/**
 * Login
 * @param loginName 
 * @param password 
 * @param userAgent 
 * @returns  JWT token
 */
export async function login(loginName: string, password: string, userAgent: string): Promise<LoginResult> {
    // query user info by login name and password
    return findUserByLoginName(loginName, password)
        .then(async (userInfo: UserTtl) => {
            // console.log("userInfo = " + JSON.stringify(userInfo));
            return createLoginSession(userInfo.id, userInfo.role_id, userAgent, userInfo.session_ttl);
        })
        .then((loginSession: LoginSession) => {
            // console.log("loginSession = " + JSON.stringify(loginSession));
            let token = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                token: token
            });
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
export async function check_token(token: string, update: boolean): Promise<VerifyResult> {
    try {
        const decoded = verify_token(token);
        if (decoded == null) {
            return Promise.reject(FailToVerifyToken);
        } else {
            const loginSession = decoded as LoginSession;
            if (update) {
                updateLoginSession(loginSession.id);
                let newToken = generate_token(loginSession, loginSession.ttl);
                return Promise.resolve({
                    loginSession: loginSession,
                    newToken: newToken
                });
            } else {
                // check expire time if near (<10min)
                const left_ttl = Math.floor(loginSession.exp - Date.now() / 1000);
                console.log(`user [${loginSession.user_id}] remain ttl : ${left_ttl} s`);
                if (left_ttl < 10 * 60) {
                    updateLoginSession(loginSession.id);
                    let newToken = generate_token(loginSession, loginSession.ttl);
                    return Promise.resolve({
                        loginSession: loginSession,
                        newToken: newToken
                    });
                } else {
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
        const decoded = verify_token(token, true);
        if (decoded == null) {
            return Promise.resolve();
        }
        const sessionId = (decoded as LoginSession).id;
        invalidateLoginSession(sessionId);
        return Promise.resolve();
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.resolve();
    }
}
