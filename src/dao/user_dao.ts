/**
 * User DAO
 */
import { prisma } from '@App/util/dbwrapper'
import { md5_string } from "@App/util/encrypt"
import { CError, FailToCreateLoginSessionRecord, FailToCreateUser, FailToInvalidateLoginSession, NotFoundAuthenRecord, NotFoundUserRecord } from '@App/util/errcode'
import { generate_id } from '@App/util/genid';
import { LoginSession } from '@App/util/jwtoken';
import { u_users } from '@prisma/client';


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
export async function findUserByLoginName(loginName: string, password: string): Promise<UserTtl> {
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
export async function createLoginSession(userId: string, roleId: string, userAgent: string, ttl: number): Promise<LoginSession> {
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
            exp: 0,
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
export async function updateLoginSession(sessionId: string): Promise<void> {
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
export async function invalidateLoginSession(sessionId: string): Promise<void> {
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

/**
 * Create user & auth records in a transaction
 * @param userName 
 * @param nickName 
 * @param roleId 
 * @param address 
 * @param phoneNumber 
 * @param email 
 * @param photoUrl 
 * @param loginName 
 * @param password 
 * @param sessionTtl 
 */
export async function createUserAndAuth(userName: string, nickName: string, roleId: string,
    address: string, phoneNumber: string, email: string, photoUrl: string,
    loginName: string, password: string, sessionTtl: number): Promise<string> {
    try {
        return await prisma.$transaction(async (tx): Promise<string> => {
            // create user record
            const user = await tx.u_users.create({
                data: {
                    id: generate_id(),
                    user_name: userName,
                    nick_name: nickName,
                    role_id: roleId,
                    address: address,
                    phone_number: phoneNumber,
                    email: email,
                    photo_url: photoUrl,
                }
            });
            if (user == undefined || user == null) {
                throw new Error(`create user failed : ${userName}`);
            }
            // create user auth record
            const auth = await tx.u_auths.create({
                data: {
                    id: generate_id(),
                    user_id: user.id,
                    login_name: loginName,
                    auth_pass: md5_string(password),
                    session_ttl: sessionTtl,
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
export async function findUserById(userId: string): Promise<UserInfo> {
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

