import { UserInfo, UserWithAuth, find_user_by_id, add_user_and_auth, find_users_by_role } from "@App/dao/user_dao"
import { ROLE_ADMN, ROLE_MANR, ROLE_MERT, ROLE_STAF, get_session_ttl } from "@App/util/constants";

/**
 * Query user information
 * @param userId 
 * @returns 
 */
export async function query_userinfo(userId: string): Promise<UserInfo> {
    try {
        const userInfo = find_user_by_id(userId);
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
        user_name: userName,
        nick_name: nickName,
        role: ROLE_ADMN,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_ADMN),
    };    
    return add_user_and_auth(userWithAuth);
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
        user_name: userName,
        nick_name: nickName,
        role: ROLE_MERT,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_MERT),
    };    
    return add_user_and_auth(userWithAuth);
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
        user_name: userName,
        nick_name: nickName,
        role: ROLE_MANR,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_MANR),
    };    
    return add_user_and_auth(userWithAuth);
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
        user_name: userName,
        nick_name: nickName,
        role: ROLE_STAF,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_STAF),
    };    
    return add_user_and_auth(userWithAuth);
}

/**
 * Find userinfo list by role
 * @param role 
 * @returns 
 */
export async function query_userinfos_by_role(role: string): Promise<UserInfo[]> {
    try {
        const userInfos = find_users_by_role(role);
        return Promise.resolve(userInfos);
    } catch (error) {
        console.error("occur error : " + error);
        return Promise.reject(error);
    }
}

