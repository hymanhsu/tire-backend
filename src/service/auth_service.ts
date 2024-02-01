import {
    find_user_by_loginName, UserTtl, add_customer_with_auth, find_customer_by_loginName,
    add_user_loginSession, find_base_role, find_merchant_roles, update_user_loginSession,
    add_customer_loginSession, update_customer_loginSession, invalidate_customer_loginSession,
    invalidate_user_loginSession
} from "../dao/user_dao.js"
import {
    FailToCheckParam, FailToUpdateToken, FailToVerifyToken,
    NotFoundUserRole
} from "../util/errcode.js"
import { ROLE_CUST, get_session_ttl } from "../util/constants.js"
import { generate_token, verify_token, LoginSession, RoleOption } from "../util/jwtoken.js";


/**
 * Signup (as customer)
 * @param userName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 */
export async function signup(loginName: string, phoneNumber: string, email: string, password: string): Promise<string> {
    return add_customer_with_auth(loginName, phoneNumber, email, password, get_session_ttl(ROLE_CUST));
}

export type LoginResult = {
    loginSession: LoginSession;
    token: string;
};

/**
 * Login as customer
 * @param loginName 
 * @param password 
 * @param userAgent 
 * @returns  JWT token
 */
export async function login(loginName: string, password: string, userAgent: string): Promise<LoginResult> {
    // query user info by login name and password
    return find_customer_by_loginName(loginName, password)
        .then(async (userInfo: UserTtl) => {
            // console.log("userInfo = " + JSON.stringify(userInfo));
            return add_customer_loginSession(userInfo.id, userInfo.role, userAgent, userInfo.session_ttl);
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

export type LoginAsUserResult = {
    loginSession: LoginSession;
    token: string;
    roleOptions?: RoleOption[] | undefined;
};

/**
 * Login as user
 * If user have multiple role, will return roles to user for choosing
 * @param loginName 
 * @param password 
 * @param userAgent 
 * @returns  JWT token
 */
export async function loginAsUser(loginName: string, password: string, userAgent: string): Promise<LoginAsUserResult> {
    try {
        // query user info by login name and password
        const userTtl: UserTtl = await find_user_by_loginName(loginName, password);
        const role: string = await find_base_role(userTtl.id);
        if (role != "") {
            // for admin / root
            const loginSession: LoginSession = await add_user_loginSession(userTtl.id, role, userAgent, userTtl.session_ttl);
            const token = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                token: token
            });
        }
        // explore role
        const roleOptions: RoleOption[] = await find_merchant_roles(userTtl.id);
        if (roleOptions.length == 0) {
            return Promise.reject(NotFoundUserRole);
        }
        // if user only have one role
        if (roleOptions.length == 1) {
            let loginSession: LoginSession = await add_user_loginSession(userTtl.id, "", userAgent, userTtl.session_ttl);
            const roleOption: RoleOption = roleOptions.at(0) as RoleOption;
            loginSession.role_option = roleOption; // set role_option
            const token = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                token: token,
            });
        }
        // if user have multiple roles, return tmporatery token
        const tmpLoginSession = {
            id: "",
            user_id: userTtl.id,
            role: "",
            ttl: userTtl.session_ttl,
            exp: Math.floor(Date.now() / 1000) + userTtl.session_ttl,
        }
        const tmpToken = generate_token(tmpLoginSession, tmpLoginSession.ttl);
        return Promise.resolve({
            loginSession: tmpLoginSession,
            token: tmpToken,
            roleOptions: roleOptions
        });
    } catch (error) {
        console.log("error = " + error);
        return Promise.reject(error);
    }
}

/**
 * Login proceed as user
 * @param tmpToken 
 * @param session 
 * @param role_options 
 * @param selected 
 * @param userAgent 
 * @returns 
 */
export async function loginProceedAsUser(tmpToken: string, session: LoginSession,
    role_options: RoleOption[], selected: number, userAgent: string): Promise<LoginAsUserResult> {
    try {
        const decoded = verify_token(tmpToken);
        if (decoded == null) {
            return Promise.reject(FailToVerifyToken);
        }
        const tmpLoginSession = decoded as LoginSession;
        if (tmpLoginSession.user_id != session.user_id) {
            return Promise.reject(FailToCheckParam);
        }
        const optionsSize = role_options.length;
        if (selected < 0 || selected >= optionsSize) {
            return Promise.reject(FailToCheckParam);
        }
        const selectRoleOption: RoleOption = role_options.at(selected) as RoleOption;
        // return token
        let loginSession: LoginSession = await add_user_loginSession(tmpLoginSession.user_id, "", userAgent, tmpLoginSession.ttl);
        loginSession.role_option = selectRoleOption; // set role_option
        const token = generate_token(loginSession, loginSession.ttl);
        return Promise.resolve({
            loginSession: loginSession,
            token: token,
        });
    } catch (error) {
        console.log("error = " + error);
        return Promise.reject(error);
    }
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
        const decoded = verify_token(token, true);
        if (decoded == null)
            return Promise.reject(FailToVerifyToken);

        const loginSession = decoded as LoginSession;
        const role = loginSession.role;

        const now = Math.floor(Date.now() / 1000);
        if (now > loginSession.exp) {
            if (Math.floor(Date.now() / 1000) - loginSession.exp > 3 * 24 * 60 * 60) { // expired 3 days, reject refresh
                return Promise.reject(FailToUpdateToken);
            }
        }

        if (update) {
            // forcely update even if has expired
            if (role == ROLE_CUST) {
                update_customer_loginSession(loginSession.id);
            } else {
                update_user_loginSession(loginSession.id);
            }
            let newToken = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                newToken: newToken
            });
        }

        // check expire time if near (<10min)
        if (now < loginSession.exp && loginSession.exp - now > 10 * 60) {
            // do nothing
            return Promise.resolve({
                loginSession: loginSession,
                newToken: ""
            });
        } else {
            // need to update token
            if (role == ROLE_CUST) {
                update_customer_loginSession(loginSession.id);
            } else {
                update_user_loginSession(loginSession.id);
            }
            let newToken = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                newToken: newToken
            });
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
        const loginSession = decoded as LoginSession;
        const role = loginSession.role;
        const sessionId = loginSession.id;
        if (role == ROLE_CUST) {
            invalidate_customer_loginSession(sessionId);
        } else {
            invalidate_user_loginSession(sessionId);
        }
        return Promise.resolve();
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.resolve();
    }
}
