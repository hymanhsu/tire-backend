import { prisma } from '@App/utils/dbwrapper'
import { md5_string } from "@App/utils/encrypt"

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
    session_ttl: Number;
};

export async function findUserByLoginName(loginName: string, password: string, userAgent: string): Promise<UserInfo> {
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
            reject(null);
        } else {
            resolve(userInfos[0]);
        }
    });
}


