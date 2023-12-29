import { UserInfo, findUserByLoginName} from "@App/dao/user_dao"
import {log} from "console"

describe('auth module', () => {
    test('findUserByLoginName success', async () => {
        const loginName = "root";
        const password = "helloworld"; 
        const userAgent = "Hello";
        const userInfo = await findUserByLoginName(loginName, password, userAgent);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });

    test('findUserByLoginName failed', async () => {
        const loginName = "root";
        const password = "wrong_password"; 
        const userAgent = "Hello";
        await expect(findUserByLoginName(loginName, password, userAgent)).rejects.toEqual(null);
    });

});

