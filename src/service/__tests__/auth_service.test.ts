import { log } from "console";
import {login, verify_token} from "../auth_service"
import { FailToVerifyToken } from "@App/util/errcode";


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
        const loginSession = await verify_token(token);
        // log("sesssssssssssss = "+JSON.stringify(loginSession));
        expect(loginSession.role_id).toBe("ROOT");
    });

    test('verify_token failed', async () => {
        const loginName = "root";
        const password = "helloworld"; 
        const userAgent = "hi";
        const token = await login(loginName, password, userAgent);
        log("token = "+token);
        expect(token).toMatch(/.+\..+\..+/);
        expect(verify_token(token+"!!!!")).rejects.toEqual(FailToVerifyToken);
    });

});

