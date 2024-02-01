var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../util/dbwrapper.js';
import { ROLE_ADMN, ROLE_MANR, ROLE_MERT, ROLE_STAF } from '../util/constants.js';
import { md5_string } from "../util/encrypt.js";
import { FailToCreateLoginSessionRecord, FailToCreateUser, FailToInvalidateLoginSession, NotFoundCustomerAuthenRecord, NotFoundUserAuthenRecord, NotFoundUserRecord } from '../util/errcode.js';
import { generate_id } from '../util/genid.js';
/**
 * Create customer & auth records in a transaction
 * @param userWithAuth
 * @returns
 */
export function add_customer_with_auth(loginName, phoneNumber, email, password, ttl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // create customer record
                const user = yield tx.c_customers.create({
                    data: {
                        id: generate_id(),
                        nick_name: loginName,
                        phone_number: phoneNumber,
                        email: email,
                    }
                });
                if (user == undefined || user == null) {
                    throw new Error(`create user failed : ${loginName}`);
                }
                // create customer auth record
                const auth = yield tx.c_auths.create({
                    data: {
                        id: generate_id(),
                        user_id: user.id,
                        login_name: loginName,
                        auth_pass: md5_string(password),
                        session_ttl: ttl,
                    }
                });
                return Promise.resolve(auth.user_id);
            }));
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateUser);
        }
    });
}
/**
 * Create user & auth records in a transaction
 * @param userWithAuth
 * @returns
 */
export function add_user_with_auth(userWithAuth) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // create user record
                const user = yield tx.u_users.create({
                    data: {
                        id: generate_id(),
                        nick_name: userWithAuth.nick_name,
                        address: userWithAuth.address,
                        phone_number: userWithAuth.phone_number,
                        email: userWithAuth.email,
                        photo_url: userWithAuth.photo_url,
                    }
                });
                if (user == undefined || user == null) {
                    throw new Error(`create user failed : ${userWithAuth.nick_name}`);
                }
                // create user auth record
                const auth = yield tx.u_auths.create({
                    data: {
                        id: generate_id(),
                        user_id: user.id,
                        login_name: userWithAuth.login_name,
                        auth_pass: md5_string(userWithAuth.password),
                        session_ttl: userWithAuth.session_ttl,
                    }
                });
                if (auth == undefined || auth == null) {
                    throw new Error(`create user failed : ${userWithAuth.nick_name}`);
                }
                // create role record only for users like administrator
                if (userWithAuth.role == ROLE_ADMN) {
                    const base_roles = yield tx.u_base_roles.create({
                        data: {
                            id: generate_id(),
                            user_id: user.id,
                            role: userWithAuth.role,
                        }
                    });
                    if (base_roles == undefined || base_roles == null) {
                        throw new Error(`create user failed : ${userWithAuth.nick_name}`);
                    }
                }
                // create role record only for users like merchant's owner/manager/staff
                if ((userWithAuth.role == ROLE_MERT
                    || userWithAuth.role == ROLE_MANR
                    || userWithAuth.role == ROLE_STAF)
                    && userWithAuth.merchant_id != "") {
                    const member = yield tx.merchant_members.create({
                        data: {
                            id: generate_id(),
                            user_id: user.id,
                            role: userWithAuth.role,
                            merchant_id: userWithAuth.merchant_id,
                        }
                    });
                    if (member == undefined || member == null) {
                        throw new Error(`create user failed : ${userWithAuth.nick_name}`);
                    }
                }
                return Promise.resolve(auth.user_id);
            }));
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateUser);
        }
    });
}
/**
 * Remove one user and its' all relation data
 * @param userId
 * @returns
 */
export function remove_user(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.u_users.delete({
                    where: {
                        id: userId,
                    }
                });
                yield tx.u_base_roles.deleteMany({
                    where: {
                        user_id: userId,
                    }
                });
                yield tx.u_auths.deleteMany({
                    where: {
                        user_id: userId,
                    }
                });
                yield tx.u_login_sessions.deleteMany({
                    where: {
                        user_id: userId,
                    }
                });
                yield tx.merchant_members.deleteMany({
                    where: {
                        user_id: userId,
                    }
                });
            }));
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateUser);
        }
    });
}
/**
 * Find an customer's basic  by login name and password
 * @param loginName
 * @param password
 * @returns
 */
export function find_customer_by_loginName(loginName, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedPassword = md5_string(password);
        try {
            const userInfos = yield prisma.$queryRawUnsafe('SELECT u.id, \'CUST\' as role, a.session_ttl  FROM c_customers u, c_auths a ' +
                'WHERE u.id = a.user_id AND u.invalid = FALSE AND a.invalid = FALSE ' +
                'AND a.auth_pass = $1 AND (u.phone_number = $2 OR u.email = $3 OR a.login_name = $4)', encodedPassword, loginName, loginName, loginName);
            return new Promise((resolve, reject) => {
                if (userInfos.length == 0) {
                    reject(NotFoundCustomerAuthenRecord);
                }
                else {
                    resolve(userInfos[0]);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundCustomerAuthenRecord);
        }
    });
}
/**
 * Find an user's basic  by login name and password
 * @param loginName
 * @param password
 * @returns
 */
export function find_user_by_loginName(loginName, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedPassword = md5_string(password);
        try {
            const userInfos = yield prisma.$queryRawUnsafe('SELECT u.id, \'\' as role, a.session_ttl  FROM u_users u, u_auths a ' +
                'WHERE u.id = a.user_id AND u.invalid = FALSE AND a.invalid = FALSE ' +
                'AND a.auth_pass = $1 AND (u.phone_number = $2 OR u.email = $3 OR a.login_name = $4)', encodedPassword, loginName, loginName, loginName);
            return new Promise((resolve, reject) => {
                if (userInfos.length == 0) {
                    reject(NotFoundUserAuthenRecord);
                }
                else {
                    resolve(userInfos[0]);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundUserAuthenRecord);
        }
    });
}
/**
 * Create login session for customer
 * @param userId
 * @param roleId
 * @param ttl : seconds
 * @returns
 */
export function add_customer_loginSession(userId, role, userAgent, ttl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loginSession = yield prisma.c_login_sessions.create({
                data: {
                    id: generate_id(),
                    user_id: userId,
                    user_agent: userAgent,
                    session_ttl: ttl,
                }
            });
            return Promise.resolve({
                id: loginSession.id,
                user_id: loginSession.user_id,
                role: role,
                ttl: ttl,
                exp: Math.floor(Date.now() / 1000) + ttl,
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateLoginSessionRecord);
        }
    });
}
export function find_base_role(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseRole = yield prisma.u_base_roles.findFirst({
            where: {
                user_id: userId,
            }
        });
        if (baseRole != null) {
            return Promise.resolve(baseRole.role);
        }
        return Promise.resolve("");
    });
}
export function find_merchant_roles(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const roleOptions = yield prisma.$queryRawUnsafe('SELECT r.*,  w.workshop_name  FROM ' +
            '(SELECT mm.role, mm.merchant_id, m.merchant_name, mm.workshop_id ' +
            'FROM merchant_members mm, merchants m ' +
            'WHERE mm.merchant_id = m.id AND m.invalid = FALSE ' +
            'AND mm.user_id = $1) r LEFT JOIN merchant_workshops w on r.workshop_id = w.id', userId);
        const result = [];
        roleOptions.forEach((item, index) => {
            if (item.role == ROLE_MERT) {
                result.push(item);
            }
            else {
                // NOT owner, must need workshop id
                if (item.workshop_id != null && item.workshop_id.trim() != '') {
                    result.push(item);
                }
            }
        });
        return Promise.resolve(result);
    });
}
/**
 * Create login session for user
 * @param userId
 * @param role
 * @param userAgent
 * @param ttl : seconds
 * @returns
 */
export function add_user_loginSession(userId, role, userAgent, ttl) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginSession = yield prisma.u_login_sessions.create({
            data: {
                id: generate_id(),
                user_id: userId,
                user_agent: userAgent,
                session_ttl: ttl,
            }
        });
        return Promise.resolve({
            id: loginSession.id,
            user_id: loginSession.user_id,
            role: role,
            ttl: ttl,
            exp: Math.floor(Date.now() / 1000) + ttl,
        });
    });
}
/**
 * Update login session
 * @param sessionId
 * @returns
 */
export function update_customer_loginSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.$executeRaw `UPDATE c_login_sessions SET renew_count=renew_count+1, u_at=now() WHERE id=${sessionId}`;
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.resolve();
        }
    });
}
export function update_user_loginSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.$executeRaw `UPDATE u_login_sessions SET renew_count=renew_count+1, u_at=now() WHERE id=${sessionId}`;
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.resolve();
        }
    });
}
/**
 * Invalidate login session
 * @param sessionId
 * @returns
 */
export function invalidate_customer_loginSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.c_login_sessions.update({
                where: {
                    id: sessionId,
                },
                data: {
                    invalid: true,
                    u_at: new Date(),
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToInvalidateLoginSession);
        }
    });
}
export function invalidate_user_loginSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.u_login_sessions.update({
                where: {
                    id: sessionId,
                },
                data: {
                    invalid: true,
                    u_at: new Date(),
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToInvalidateLoginSession);
        }
    });
}
/**
 * Find user infomation
 * @param userId
 * @returns
 */
export function find_user_by_id(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfo = yield prisma.u_users.findUnique({
                where: {
                    id: userId
                }
            });
            return new Promise((resolve, reject) => {
                if (userInfo === null) {
                    reject(NotFoundUserRecord);
                }
                else {
                    resolve(userInfo);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundUserRecord);
        }
    });
}
export function find_customer_by_id(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfo = yield prisma.c_customers.findUnique({
                where: {
                    id: userId
                }
            });
            return new Promise((resolve, reject) => {
                if (userInfo === null) {
                    reject(NotFoundUserRecord);
                }
                else {
                    resolve(userInfo);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundUserRecord);
        }
    });
}
export function find_all_administrators() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfos = yield prisma.$queryRawUnsafe('SELECT u.*  FROM u_users u, u_base_roles b ' +
                'WHERE u.id = b.user_id  ' +
                'AND b.role = \'ADMN\' ORDER BY u.c_at DESC');
            return Promise.resolve(userInfos);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundUserRecord);
        }
    });
}
