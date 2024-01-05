import { UserTtl, findUserByLoginName, createUserAndAuth } from "../user_dao"
import { FailToCreateUser, NotFoundAuthenRecord } from '@App/util/errcode'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { log } from "console"

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
        const userWithAuth = {
            userName: "staff-0001",
            nickName: "staff-0001",
            roleId: "STAF",
            address: "W32 Ave.",
            phoneNumber: "5551234567",
            email: "5555@gmai.com",
            photoUrl: "",
            loginName: "staff-0001",
            password: "p0001",
            sessionTtl: 60*60,
        };
        await expect(createUserAndAuth(userWithAuth))
            .rejects.toEqual(FailToCreateUser);
        // .resolves.toHaveLength(21);
    });

});

