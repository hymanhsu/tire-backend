import { UserInfo, add_loginSession, update_loginSession, find_user_by_loginName, add_user_and_auth, invalidate_loginSession, UserTtl } from "@App/dao/user_dao"
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
        user_name: loginName,
        nick_name: loginName,
        role: ROLE_CUST,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_CUST),
    };    
    return add_user_and_auth(userWithAuth);
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
    return find_user_by_loginName(loginName, password)
        .then(async (userInfo: UserTtl) => {
            // console.log("userInfo = " + JSON.stringify(userInfo));
            return add_loginSession(userInfo.id, userInfo.role_id, userAgent, userInfo.session_ttl);
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
                update_loginSession(loginSession.id);
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
                    update_loginSession(loginSession.id);
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
        invalidate_loginSession(sessionId);
        return Promise.resolve();
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.resolve();
    }
}
