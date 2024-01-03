/**
 * User DAO
 */
import { prisma } from '@App/util/dbwrapper'
import { md5_string } from "@App/util/encrypt"
import { CError, FailToCreateLoginSessionRecord, FailToCreateUser, NotFoundAuthenRecord } from '@App/util/errcode'
import { generate_id } from '@App/util/genid';


export type UserInfo = {
    id: string;
    user_name: string;
    nick_name: string;
    role_id: string;
    address: string;
    phone_number: string;
    email: string;
    photo_url: string;
    invalid: boolean;
    c_at: Date;
    u_at: Date;
    session_ttl: number;
};

/**
 * Find an user's basic infomation by login name and password
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function findUserByLoginName(loginName: string, password: string): Promise<UserInfo> {
    const encodedPassword = md5_string(password);
    const userInfos: UserInfo[] = await prisma.$queryRawUnsafe(
        'SELECT u.*, a.session_ttl  FROM u_users u, u_auths a ' +
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
}

export type LoginSession = {
    id: string;
    user_id: string;
    role_id: string;
    user_agent: string;
    ttl: number;
    exp_at: Date;
};

/**
 * Create login session 
 * @param session 
 * @returns 
 */
export async function createLoginSession(userId: string, roleId: string, userAgent: string, ttl: number): Promise<LoginSession> {
    let expAt = new Date(Date.now() + ttl * (60 * 60 * 1000));
    try {
        const loginSession = await prisma.u_login_sessions.create({
            data: {
                id: generate_id(),
                user_id: userId,
                user_agent: userAgent,
                exp_at: expAt,
            }
        });
        return Promise.resolve({
            id: loginSession.id,
            user_id: loginSession.user_id as string,
            role_id: roleId,
            user_agent: loginSession.user_agent as string,
            ttl: ttl * (60 * 60),
            exp_at: loginSession.exp_at,
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateLoginSessionRecord);
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
    try{
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
    }catch(error){
        console.error(error);
        return Promise.reject(FailToCreateUser);
    }
}

