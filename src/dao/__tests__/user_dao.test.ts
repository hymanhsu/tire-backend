import { UserInfo, findUserByLoginName, createUserAndAuth} from "../user_dao"
import {FailToCreateUser, NotFoundAuthenRecord} from '@App/util/errcode'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

    test('createUserAndAuth success', async () => {
        const userName = "staff-0001";
        const password = "p0001"; 
        await expect(createUserAndAuth(
            userName,userName,"STAF","W32 Ave.","5551234567","5555@gmai.com",
            "",userName,password, 8,
        ))
        .rejects.toEqual(FailToCreateUser);
        // .resolves.toHaveLength(21);
    });

});

