import { UserInfo, findUserById } from "@App/dao/user_dao"

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
