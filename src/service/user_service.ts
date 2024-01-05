import { UserInfo, UserWithAuth, findUserById, createUserAndAuth, findUsersByRole } from "@App/dao/user_dao"
import { ROLE_ADMN, ROLE_MANR, ROLE_MERT, ROLE_STAF, get_session_ttl } from "@App/util/constants";

/**
 * Query user information
 * @param userId 
 * @returns 
 */
export async function query_userinfo(userId: string): Promise<UserInfo> {
    try {
        const userInfo = findUserById(userId);
        return Promise.resolve(userInfo);
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.reject(error);
    }
}

/**
 * Create a new administrator
 * @param userName 
 * @param nickName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function create_administrator(userName:string, nickName:string, phoneNumber:string, 
    email:string, loginName:string, password:string): Promise<string> {
    const userWithAuth = {
        userName: userName,
        nickName: nickName,
        roleId: ROLE_ADMN,
        address: "",
        phoneNumber: phoneNumber,
        email: email,
        photoUrl: "",
        loginName: loginName,
        password: password,
        sessionTtl: get_session_ttl(ROLE_ADMN),
    };    
    return createUserAndAuth(userWithAuth);
}

/**
 * Create a new owner of a merchant
 * @param userName 
 * @param nickName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function create_merchant_owner(userName:string, nickName:string, phoneNumber:string, 
    email:string, loginName:string, password:string): Promise<string> {
    const userWithAuth = {
        userName: userName,
        nickName: nickName,
        roleId: ROLE_MERT,
        address: "",
        phoneNumber: phoneNumber,
        email: email,
        photoUrl: "",
        loginName: loginName,
        password: password,
        sessionTtl: get_session_ttl(ROLE_MERT),
    };    
    return createUserAndAuth(userWithAuth);
}

/**
 * Create a new manager of a workshop
 * @param userName 
 * @param nickName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function create_workshop_manager(userName:string, nickName:string, phoneNumber:string, 
    email:string, loginName:string, password:string): Promise<string> {
    const userWithAuth = {
        userName: userName,
        nickName: nickName,
        roleId: ROLE_MANR,
        address: "",
        phoneNumber: phoneNumber,
        email: email,
        photoUrl: "",
        loginName: loginName,
        password: password,
        sessionTtl: get_session_ttl(ROLE_MANR),
    };    
    return createUserAndAuth(userWithAuth);
}

/**
 * Create a new staff of a workshop
 * @param userName 
 * @param nickName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function create_workshop_staff(userName:string, nickName:string, phoneNumber:string, 
    email:string, loginName:string, password:string): Promise<string> {
    const userWithAuth = {
        userName: userName,
        nickName: nickName,
        roleId: ROLE_STAF,
        address: "",
        phoneNumber: phoneNumber,
        email: email,
        photoUrl: "",
        loginName: loginName,
        password: password,
        sessionTtl: get_session_ttl(ROLE_STAF),
    };    
    return createUserAndAuth(userWithAuth);
}

/**
 * Find userinfo list by role
 * @param role 
 * @returns 
 */
export async function query_userinfos_by_role(role: string): Promise<UserInfo[]> {
    try {
        const userInfos = findUsersByRole(role);
        return Promise.resolve(userInfos);
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.reject(error);
    }
}

