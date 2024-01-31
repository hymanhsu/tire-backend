var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { find_user_by_id, add_user_with_auth, find_customer_by_id } from "@App/dao/user_dao";
import { ROLE_ADMN, ROLE_CUST, ROLE_MANR, ROLE_MERT, ROLE_STAF, get_session_ttl } from "@App/util/constants";
/**
 * Query user information
 * @param userId
 * @returns
 */
export function query_userinfo(userId, role) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (role == ROLE_CUST) {
                return find_customer_by_id(userId);
            }
            else {
                return find_user_by_id(userId);
            }
        }
        catch (error) {
            console.error("occur error : " + error);
            return Promise.reject(error);
        }
    });
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
export function create_administrator(nickName, phoneNumber, email, loginName, password) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
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
export function create_merchant_owner(merchantId, nickName, phoneNumber, email, loginName, password) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
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
export function create_workshop_manager(merchantId, nickName, phoneNumber, email, loginName, password) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
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
export function create_workshop_staff(merchantId, nickName, phoneNumber, email, loginName, password) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
