/**
 * User DAO
 */
import { prisma } from '@App/util/dbwrapper'
import { md5_string } from "@App/util/encrypt"
import { CError, FailToCreateLoginSessionRecord, FailToCreateUser, FailToInvalidateLoginSession, NotFoundAuthenRecord, NotFoundUserRecord } from '@App/util/errcode'
import { generate_id } from '@App/util/genid';
import { LoginSession } from '@App/util/jwtoken';
// import { u_users } from '@prisma/client';


export type UserTtl = {
    id: string;
    role_id: string;
    session_ttl: number;
};

/**
 * Find an user's basic infomation by login name and password
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function find_user_by_loginName(loginName: string, password: string): Promise<UserTtl> {
    const encodedPassword = md5_string(password);
    try {
        const userInfos: UserTtl[] = await prisma.$queryRawUnsafe(
            'SELECT u.id, u.role_id, a.session_ttl  FROM u_users u, u_auths a ' +
            'WHERE u.id = a.user_id AND u.invalid = FALSE AND a.invalid = FALSE ' +
            'AND a.auth_pass = $1 AND (u.phone_number = $2 OR u.email = $3 OR a.login_name = $4)',
            encodedPassword,
            loginName, loginName, loginName
        );
        return new Promise((resolve, reject) => {
            if (userInfos === undefined || userInfos.length === 0) {
                reject(NotFoundAuthenRecord);
            } else {
                resolve(userInfos[0]);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundAuthenRecord);
    }
}

/**
 * Create login session 
 * @param userId 
 * @param roleId 
 * @param userAgent 
 * @param ttl : seconds
 * @returns 
 */
export async function add_loginSession(userId: string, roleId: string, userAgent: string, ttl: number): Promise<LoginSession> {
    try {
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
            role_id: roleId,
            user_agent: loginSession.user_agent as string,
            ttl: ttl,
            exp: Math.floor(Date.now() / 1000) + ttl,
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateLoginSessionRecord);
    }
}

/**
 * Update login session
 * @param sessionId 
 * @returns 
 */
export async function update_loginSession(sessionId: string): Promise<void> {
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
export async function invalidate_loginSession(sessionId: string): Promise<void> {
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

export type UserWithAuth = {
    user_name: string;
    nick_name: string;
    role: string;
    address: string;
    phone_number: string;
    email: string;
    photo_url: string;
    login_name: string;
    password: string;
    session_ttl: number;
};

/**
 * Create user & auth records in a transaction
 * @param userWithAuth 
 * @returns 
 */
export async function add_user_and_auth(userWithAuth:UserWithAuth): Promise<string> {
    try {
        return await prisma.$transaction(async (tx): Promise<string> => {
            // create user record
            const user = await tx.u_users.create({
                data: {
                    id: generate_id(),
                    user_name: userWithAuth.user_name,
                    nick_name: userWithAuth.nick_name,
                    role_id: userWithAuth.role,
                    address: userWithAuth.address,
                    phone_number: userWithAuth.phone_number,
                    email: userWithAuth.email,
                    photo_url: userWithAuth.photo_url,
                }
            });
            if (user == undefined || user == null) {
                throw new Error(`create user failed : ${userWithAuth.user_name}`);
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
            return Promise.resolve(auth.user_id as string);
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateUser);
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
export async function find_user_by_id(userId: string): Promise<UserInfo> {
    try {
        const userInfo: UserInfo | null = await prisma.u_users.findUnique({
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


/**
 * Find user list by role
 */
export async function find_users_by_role(role: string): Promise<UserInfo[]> {
    try {
        const userInfos: UserInfo[] = await prisma.u_users.findMany({
            where: {
                role_id: role
            }
        });
        return new Promise((resolve, reject) => {
            if (userInfos == null || userInfos == undefined) {
                reject(NotFoundUserRecord);
            } else {
                resolve(userInfos);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundUserRecord);
    }
}
