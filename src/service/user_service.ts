import {
    find_user_by_id, add_user_with_auth,
    find_customer_by_id
} from "../dao/user_dao.js"
import {
    ROLE_ADMN, ROLE_CUST, ROLE_MANR, ROLE_MERT, ROLE_STAF,
    get_session_ttl
} from "../util/constants.js";


/**
 * Query user information
 * @param userId 
 * @returns 
 */
export async function query_userinfo(userId: string, role: string): Promise<any> {
    try {
        if (role == ROLE_CUST) {
            return find_customer_by_id(userId);
        } else {
            return find_user_by_id(userId);
        }
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
export async function create_administrator(nickName: string, phoneNumber: string,
    email: string, loginName: string, password: string): Promise<string> {
    const userWithAuth = {
        role: ROLE_ADMN,
        nick_name: nickName,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_ADMN),
        merchant_id: "",
    };
    return add_user_with_auth(userWithAuth);
}


/**
 * Create a new owner of a merchant
 * @param merchantId 
 * @param nickName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function create_merchant_owner(merchantId: string, nickName: string, phoneNumber: string,
    email: string, loginName: string, password: string): Promise<string> {
    const userWithAuth = {
        role: ROLE_MERT,
        nick_name: nickName,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_MERT),
        merchant_id: merchantId,
    };
    return add_user_with_auth(userWithAuth);
}

/**
 * Create a new manager of a workshop
 * @param merchantId 
 * @param nickName 
 * @param phoneNumber 
 * @param email 
 * @param loginName 
 * @param password 
 * @returns 
 */
export async function create_workshop_manager(merchantId: string, nickName: string, phoneNumber: string,
    email: string, loginName: string, password: string): Promise<string> {
    const userWithAuth = {
        role: ROLE_MANR,
        nick_name: nickName,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_MANR),
        merchant_id: merchantId,
    };
    return add_user_with_auth(userWithAuth);
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
export async function create_workshop_staff(merchantId: string, nickName: string, phoneNumber: string,
    email: string, loginName: string, password: string): Promise<string> {
    const userWithAuth = {
        role: ROLE_STAF,
        nick_name: nickName,
        address: "",
        phone_number: phoneNumber,
        email: email,
        photo_url: "",
        login_name: loginName,
        password: password,
        session_ttl: get_session_ttl(ROLE_STAF),
        merchant_id: merchantId,
    };
    return add_user_with_auth(userWithAuth);
}


