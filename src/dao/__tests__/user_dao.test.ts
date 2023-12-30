import { UserInfo, findUserByLoginName} from "../user_dao"
import {NotFoundAuthenRecord} from '@App/util/errcode'
import {log} from "console"

describe('auth module', () => {
    test('findUserByLoginName success by login name', async () => {
        const loginName = "root";
        const password = "helloworld"; 
        const userInfo = await findUserByLoginName(loginName, password);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });
    
    test('findUserByLoginName success by login email', async () => {
        const loginName = "root666@gmail.com";
        const password = "helloworld"; 
        const userInfo = await findUserByLoginName(loginName, password);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });

    test('findUserByLoginName success by login phone number', async () => {
        const loginName = "6661236789";
        const password = "helloworld"; 
        const userInfo = await findUserByLoginName(loginName, password);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });

    test('findUserByLoginName failed', async () => {
        const loginName = "root";
        const password = "wrong_password"; 
        await expect(findUserByLoginName(loginName, password)).rejects.toEqual(NotFoundAuthenRecord);
    });

});

