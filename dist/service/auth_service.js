var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { find_user_by_loginName, add_customer_with_auth, find_customer_by_loginName, add_user_loginSession, find_base_role, find_merchant_roles, update_user_loginSession, add_customer_loginSession, update_customer_loginSession, invalidate_customer_loginSession, invalidate_user_loginSession } from "@App/dao/user_dao";
import { FailToCheckParam, FailToUpdateToken, FailToVerifyToken, NotFoundUserRole } from "@App/util/errcode";
import { ROLE_CUST, get_session_ttl } from "@App/util/constants";
import { generate_token, verify_token } from "@App/util/jwtoken";
/**
 * Signup (as customer)
 * @param userName
 * @param phoneNumber
 * @param email
 * @param loginName
 * @param password
 */
export function signup(loginName, phoneNumber, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return add_customer_with_auth(loginName, phoneNumber, email, password, get_session_ttl(ROLE_CUST));
    });
}
/**
 * Login as customer
 * @param loginName
 * @param password
 * @param userAgent
 * @returns  JWT token
 */
export function login(loginName, password, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        // query user info by login name and password
        return find_customer_by_loginName(loginName, password)
            .then((userInfo) => __awaiter(this, void 0, void 0, function* () {
            // console.log("userInfo = " + JSON.stringify(userInfo));
            return add_customer_loginSession(userInfo.id, userInfo.role, userAgent, userInfo.session_ttl);
        }))
            .then((loginSession) => {
            // console.log("loginSession = " + JSON.stringify(loginSession));
            let token = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                token: token
            });
        })
            .catch((error) => {
            console.log("error = " + error);
            return Promise.reject(error);
        });
    });
}
/**
 * Login as user
 * If user have multiple role, will return roles to user for choosing
 * @param loginName
 * @param password
 * @param userAgent
 * @returns  JWT token
 */
export function loginAsUser(loginName, password, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // query user info by login name and password
            const userTtl = yield find_user_by_loginName(loginName, password);
            const role = yield find_base_role(userTtl.id);
            if (role != "") {
                // for admin / root
                const loginSession = yield add_user_loginSession(userTtl.id, role, userAgent, userTtl.session_ttl);
                const token = generate_token(loginSession, loginSession.ttl);
                return Promise.resolve({
                    loginSession: loginSession,
                    token: token
                });
            }
            // explore role
            const roleOptions = yield find_merchant_roles(userTtl.id);
            if (roleOptions.length == 0) {
                return Promise.reject(NotFoundUserRole);
            }
            // if user only have one role
            if (roleOptions.length == 1) {
                let loginSession = yield add_user_loginSession(userTtl.id, "", userAgent, userTtl.session_ttl);
                const roleOption = roleOptions.at(0);
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
            };
            const tmpToken = generate_token(tmpLoginSession, tmpLoginSession.ttl);
            return Promise.resolve({
                loginSession: tmpLoginSession,
                token: tmpToken,
                roleOptions: roleOptions
            });
        }
        catch (error) {
            console.log("error = " + error);
            return Promise.reject(error);
        }
    });
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
export function loginProceedAsUser(tmpToken, session, role_options, selected, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = verify_token(tmpToken);
            if (decoded == null) {
                return Promise.reject(FailToVerifyToken);
            }
            const tmpLoginSession = decoded;
            if (tmpLoginSession.user_id != session.user_id) {
                return Promise.reject(FailToCheckParam);
            }
            const optionsSize = role_options.length;
            if (selected < 0 || selected >= optionsSize) {
                return Promise.reject(FailToCheckParam);
            }
            const selectRoleOption = role_options.at(selected);
            // return token
            let loginSession = yield add_user_loginSession(tmpLoginSession.user_id, "", userAgent, tmpLoginSession.ttl);
            loginSession.role_option = selectRoleOption; // set role_option
            const token = generate_token(loginSession, loginSession.ttl);
            return Promise.resolve({
                loginSession: loginSession,
                token: token,
            });
        }
        catch (error) {
            console.log("error = " + error);
            return Promise.reject(error);
        }
    });
}
/**
 * Verify token
 * @param token
 * @param update : update token forcely
 * @returns LoginSession
 */
export function check_token(token, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = verify_token(token, true);
            if (decoded == null)
                return Promise.reject(FailToVerifyToken);
            const loginSession = decoded;
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
                }
                else {
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
            }
            else {
                // need to update token
                if (role == ROLE_CUST) {
                    update_customer_loginSession(loginSession.id);
                }
                else {
                    update_user_loginSession(loginSession.id);
                }
                let newToken = generate_token(loginSession, loginSession.ttl);
                return Promise.resolve({
                    loginSession: loginSession,
                    newToken: newToken
                });
            }
        }
        catch (error) {
            console.error("occur error : " + error);
            return Promise.reject(FailToVerifyToken);
        }
    });
}
/**
 * Logout
 * @param token
 * @returns
 */
export function logout(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = verify_token(token, true);
            if (decoded == null) {
                return Promise.resolve();
            }
            const loginSession = decoded;
            const role = loginSession.role;
            const sessionId = loginSession.id;
            if (role == ROLE_CUST) {
                invalidate_customer_loginSession(sessionId);
            }
            else {
                invalidate_user_loginSession(sessionId);
            }
            return Promise.resolve();
        }
        catch (error) {
            console.error("occur error : " + error);
            return Promise.resolve();
        }
    });
}
