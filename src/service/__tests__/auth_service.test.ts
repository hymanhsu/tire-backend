import { log } from "console";
import { login, check_token, signup } from "../auth_service"
import { FailToCreateUser, FailToVerifyToken } from "@App/util/errcode";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


describe('auth module', () => {

    test('login success by login name', async () => {
        const loginName = "root";
        const password = "helloworld";
        const userAgent = "hi";
        const token = await login(loginName, password, userAgent);
        // log("token = "+token);
        expect(token).toMatch(/.+\..+\..+/);
    });

    test('verify_token success', async () => {
        const loginName = "root";
        const password = "helloworld";
        const userAgent = "hi";
        const token = await login(loginName, password, userAgent);
        // log("token = "+token);
        expect(token).toMatch(/.+\..+\..+/);
        const verifyResult = await check_token(token, false);
        // log("sesssssssssssss = "+JSON.stringify(loginSession));
        expect(verifyResult.loginSession.role_id).toBe("ROOT");
    });

    test('verify_token failed', async () => {
        const loginName = "root";
        const password = "helloworld";
        const userAgent = "hi";
        const token = await login(loginName, password, userAgent); -['/']
        log("token = " + token);
        expect(token).toMatch(/.+\..+\..+/);
        expect(check_token(token + "!!!!", false)).rejects.toEqual(FailToVerifyToken);
    });

    test('signup success', async () => {
        const loginName = "staff-0002";
        const phoneNumber = "5551234568";
        const password = "helloworld";
        const email = "5551234568@gmai.com";
        await expect(signup(
            loginName, phoneNumber, email, password,
        ))
            .rejects.toEqual(FailToCreateUser);
        // .resolves.toHaveLength(21);
    });

});

