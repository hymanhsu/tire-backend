/**
 * User DAO
 */
import { c_customers, u_base_roles, u_users } from '@prisma/client';
import { prisma } from '../util/dbwrapper.js';
import { ROLE_ADMN, ROLE_MANR, ROLE_MERT, ROLE_STAF } from '../util/constants.js';
import { md5_string } from "../util/encrypt.js";
import {
    FailToCreateLoginSessionRecord, FailToCreateUser, FailToInvalidateLoginSession,
    NotFoundCustomerAuthenRecord, NotFoundUserAuthenRecord, NotFoundUserRecord
} from '../util/errcode.js';
import { generate_id } from '../util/genid.js';
import { LoginSession, RoleOption } from '../util/jwtoken.js';


/**
 * Create customer & auth records in a transaction
 * @param userWithAuth 
 * @returns 
 */
export async function add_customer_with_auth(loginName: string, phoneNumber: string, email: string,
    password: string, ttl: number): Promise<string> {
    try {
        return await prisma.$transaction(async (tx): Promise<string> => {
            // create customer record
            const user = await tx.c_customers.create({
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
            const auth = await tx.c_auths.create({
                data: {
                    id: generate_id(),
                    user_id: user.id,
                    login_name: loginName,
                    auth_pass: md5_string(password),
                    session_ttl: ttl,
                }
            });
            return Promise.resolve(auth.user_id as string);
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateUser);
    }
}


export type UserWithAuth = {
    role: string;
    nick_name: string;
    address: string;
    phone_number: string;
    email: string;
    photo_url: string;
    login_name: string;
    password: string;
    session_ttl: number;
    merchant_id: string;
};

/**
 * Create user & auth records in a transaction
 * @param userWithAuth 
 * @returns 
 */
export async function add_user_with_auth(userWithAuth: UserWithAuth): Promise<string> {
    try {
        return await prisma.$transaction(async (tx): Promise<string> => {
            // create user record
            const user = await tx.u_users.create({
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
            const auth = await tx.u_auths.create({
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
                const base_roles = await tx.u_base_roles.create({
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
                const member = await tx.merchant_members.create({
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
            return Promise.resolve(auth.user_id as string);
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateUser);
    }
}


/**
 * Remove one user and its' all relation data
 * @param userId 
 * @returns 
 */
export async function remove_user(userId: string): Promise<void> {
    try {
        return await prisma.$transaction(async (tx): Promise<void> => {
            await tx.u_users.delete({
                where: {
                    id: userId,
                }
            });
            await tx.u_base_roles.deleteMany({
                where: {
                    user_id: userId,
                }
            });
            await tx.u_auths.deleteMany({
                where: {
                    user_id: userId,
                }
            });
            await tx.u_login_sessions.deleteMany({
                where: {
                    user_id: userId,
                }
            });
            await tx.merchant_members.deleteMany({
                where: {
                    user_id: userId,
                }
            });
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateUser);
    }
}

export type UserTtl = {
    id: string;
    role: string;
    session_ttl: number;
};

/**
 * Find an customer's basic  by login name and password
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function find_customer_by_loginName(loginName: string, password: string): Promise<UserTtl> {
    const encodedPassword = md5_string(password);
    try {
        const userInfos: UserTtl[] = await prisma.$queryRawUnsafe(
            'SELECT u.id, \'CUST\' as role, a.session_ttl  FROM c_customers u, c_auths a ' +
            'WHERE u.id = a.user_id AND u.invalid = FALSE AND a.invalid = FALSE ' +
            'AND a.auth_pass = $1 AND (u.phone_number = $2 OR u.email = $3 OR a.login_name = $4)',
            encodedPassword,
            loginName, loginName, loginName
        );
        return new Promise((resolve, reject) => {
            if (userInfos.length == 0) {
                reject(NotFoundCustomerAuthenRecord);
            } else {
                resolve(userInfos[0]);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundCustomerAuthenRecord);
    }
}

/**
 * Find an user's basic  by login name and password
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function find_user_by_loginName(loginName: string, password: string): Promise<UserTtl> {
    const encodedPassword = md5_string(password);
    try {
        const userInfos: UserTtl[] = await prisma.$queryRawUnsafe(
            'SELECT u.id, \'\' as role, a.session_ttl  FROM u_users u, u_auths a ' +
            'WHERE u.id = a.user_id AND u.invalid = FALSE AND a.invalid = FALSE ' +
            'AND a.auth_pass = $1 AND (u.phone_number = $2 OR u.email = $3 OR a.login_name = $4)',
            encodedPassword,
            loginName, loginName, loginName
        );
        return new Promise((resolve, reject) => {
            if (userInfos.length == 0) {
                reject(NotFoundUserAuthenRecord);
            } else {
                resolve(userInfos[0]);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundUserAuthenRecord);
    }
}

/**
 * Create login session for customer
 * @param userId 
 * @param roleId 
 * @param ttl : seconds
 * @returns 
 */
export async function add_customer_loginSession(userId: string, role: string, userAgent: string, ttl: number): Promise<LoginSession> {
    try {
        const loginSession = await prisma.c_login_sessions.create({
            data: {
                id: generate_id(),
                user_id: userId,
                user_agent: userAgent,
                session_ttl: ttl,
            }
        });
        return Promise.resolve({
            id: loginSession.id,
            user_id: loginSession.user_id as string,
            role: role,
            ttl: ttl,
            exp: Math.floor(Date.now() / 1000) + ttl,
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateLoginSessionRecord);
    }
}

export async function find_base_role(userId: string): Promise<string> {
    const baseRole: u_base_roles | null = await prisma.u_base_roles.findFirst({
        where: {
            user_id: userId,
        }
    });
    if (baseRole != null) {
        return Promise.resolve(baseRole.role);
    }
    return Promise.resolve("");
}

export async function find_merchant_roles(userId: string): Promise<RoleOption[]> {
    const roleOptions: RoleOption[] = await prisma.$queryRawUnsafe(
        'SELECT r.*,  w.workshop_name  FROM ' +
        '(SELECT mm.role, mm.merchant_id, m.merchant_name, mm.workshop_id ' +
        'FROM merchant_members mm, merchants m ' +
        'WHERE mm.merchant_id = m.id AND m.invalid = FALSE ' +
        'AND mm.user_id = $1) r LEFT JOIN merchant_workshops w on r.workshop_id = w.id',
        userId
    );
    const result: RoleOption[] = [];
    roleOptions.forEach((item, index) => {
        if (item.role == ROLE_MERT) {
            result.push(item);
        } else {
            // NOT owner, must need workshop id
            if (item.workshop_id != null && item.workshop_id.trim() != '') {
                result.push(item);
            }
        }
    });
    return Promise.resolve(result);
}

/**
 * Create login session for user
 * @param userId 
 * @param role
 * @param userAgent 
 * @param ttl : seconds
 * @returns 
 */
export async function add_user_loginSession(userId: string, role: string, userAgent: string, ttl: number): Promise<LoginSession> {
    const loginSession = await prisma.u_login_sessions.create({
        data: {
            id: generate_id(),
            user_id: userId,
            user_agent: userAgent,
            session_ttl: ttl,
        }
    });
    return Promise.resolve({
        id: loginSession.id,
        user_id: loginSession.user_id as string,
        role: role,
        ttl: ttl,
        exp: Math.floor(Date.now() / 1000) + ttl,
    });
}


/**
 * Update login session
 * @param sessionId 
 * @returns 
 */
export async function update_customer_loginSession(sessionId: string): Promise<void> {
    try {
        const result: number = await prisma.$executeRaw`UPDATE c_login_sessions SET renew_count=renew_count+1, u_at=now() WHERE id=${sessionId}`;
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.resolve();
    }
}

export async function update_user_loginSession(sessionId: string): Promise<void> {
    try {
        const result: number = await prisma.$executeRaw`UPDATE u_login_sessions SET renew_count=renew_count+1, u_at=now() WHERE id=${sessionId}`;
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.resolve();
    }
}


/**
 * Invalidate login session
 * @param sessionId 
 * @returns 
 */
export async function invalidate_customer_loginSession(sessionId: string): Promise<void> {
    try {
        await prisma.c_login_sessions.update({
            where: {
                id: sessionId,
            },
            data: {
                invalid: true,
                u_at: new Date(),
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToInvalidateLoginSession);
    }
}

export async function invalidate_user_loginSession(sessionId: string): Promise<void> {
    try {
        await prisma.u_login_sessions.update({
            where: {
                id: sessionId,
            },
            data: {
                invalid: true,
                u_at: new Date(),
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToInvalidateLoginSession);
    }
}

export type UserInfo = {
    id: string;
    user_name: string;
    nick_name: string | null;
    role_id: string | null;
    address: string | null;
    phone_number: string | null;
    email: string | null;
    photo_url: string | null;
    invalid: boolean | null;
    c_at: Date | null;
    u_at: Date | null;
};

/**
 * Find user infomation
 * @param userId 
 * @returns 
 */
export async function find_user_by_id(userId: string): Promise<u_users> {
    try {
        const userInfo: u_users | null = await prisma.u_users.findUnique({
            where: {
                id: userId
            }
        });
        return new Promise((resolve, reject) => {
            if (userInfo === null) {
                reject(NotFoundUserRecord);
            } else {
                resolve(userInfo);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundUserRecord);
    }
}

export async function find_customer_by_id(userId: string): Promise<c_customers> {
    try {
        const userInfo: c_customers | null = await prisma.c_customers.findUnique({
            where: {
                id: userId
            }
        });
        return new Promise((resolve, reject) => {
            if (userInfo === null) {
                reject(NotFoundUserRecord);
            } else {
                resolve(userInfo);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundUserRecord);
    }
}

export async function find_all_administrators(): Promise<u_users[]> {
    try {
        const userInfos: u_users[] = await prisma.$queryRawUnsafe(
            'SELECT u.*  FROM u_users u, u_base_roles b ' +
            'WHERE u.id = b.user_id  ' +
            'AND b.role = \'ADMN\' ORDER BY u.c_at DESC'
        );
        return Promise.resolve(userInfos);
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundUserRecord);
    }
}
