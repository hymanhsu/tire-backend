import { UserTtl, add_user_with_auth, find_customer_by_loginName  } from "../user_dao"
import { FailToCreateUser, NotFoundAuthenRecord } from '../../util/errcode'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { log } from "console"

describe('auth module', () => {
    test('findUserByLoginName success by login name', async () => {
        const loginName = "root";
        const password = "helloworld";
        const userInfo = await find_customer_by_loginName(loginName, password);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });

    test('findUserByLoginName success by login email', async () => {
        const loginName = "root666@gmail.com";
        const password = "helloworld";
        const userInfo = await find_customer_by_loginName(loginName, password);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });

    test('findUserByLoginName success by login phone number', async () => {
        const loginName = "6661236789";
        const password = "helloworld";
        const userInfo = await find_customer_by_loginName(loginName, password);
        // log("rrrr = "+JSON.stringify(userInfo));
        expect(userInfo.id).toBe("AWPo68O4So3oederv9jiJ");
    });

    test('findUserByLoginName failed', async () => {
        const loginName = "root";
        const password = "wrong_password";
        await expect(find_customer_by_loginName(loginName, password)).rejects.toEqual(NotFoundAuthenRecord);
    });

    test('createUserAndAuth success', async () => {
        const userWithAuth = {
            merchant_id: "",
            nick_name: "staff-0001",
            role: "STAF",
            address: "W32 Ave.",
            phone_number: "5551234567",
            email: "5555@gmai.com",
            photo_url: "",
            login_name: "staff-0001",
            password: "p0001",
            session_ttl: 60*60,
        };
        await expect(add_user_with_auth(userWithAuth))
            .rejects.toEqual(FailToCreateUser);
        // .resolves.toHaveLength(21);
    });

});

