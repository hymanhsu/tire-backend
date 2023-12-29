import { md5_string, aes_encrypt, aes_decrypt, Encryped } from "@App/utils/encrypt"
import {log} from "console"

describe('encrypt module', () => {
    test('md5_string', () => {
        const result = md5_string("helloworld");
        // log("rrrr = "+result);
        expect(result).toBe("fc5e038d38a57032085441e7fe7010b0");
    });

    test('aes_encrypt', () => {
        const result = aes_encrypt("helloworld");
        log("rrrr = "+result);
        expect(result.encrypted).toHaveLength(32);
    });

    test('aes_decrypt', () => {
        const result = aes_encrypt("helloworld");
        // log("rrrr = "+result);
        const decoded = aes_decrypt(result);
        expect(decoded).toBe("helloworld");
    });

});


