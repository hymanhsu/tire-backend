var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
// export const SECRET_KEY: Secret = 'your-secret-key-here';
/**
 * Generate token
 * @param ttl
 * @param payload
 * @returns
 */
export function generate_token(payload, ttl) {
    var token = jwt.sign(Object.assign(Object.assign({}, payload), { exp: Math.floor(Date.now() / 1000) + ttl }), process.env.RSA_PRIVATE_KEY || "", {
        algorithm: 'RS256',
    });
    return token;
}
/**
 * Vefify the token
 * @param token
 * @param ignoreExpiration
 * @returns
 */
export function verify_token(token, ignoreExpiration = false) {
    try {
        const decoded = jwt.verify(token, process.env.RSA_PUBLIC_KEY || "", {
            algorithms: ['RS256'],
            ignoreExpiration: ignoreExpiration,
        });
        if (decoded == undefined || decoded == null) {
            return null;
        }
        return decoded;
    }
    catch (error) {
        console.log(token);
        console.log(error);
        return null;
    }
}
/**
 * Check the token and add the login session into request if need
 * @param req
 * @param res
 * @param next
 */
export function checkAuthToken(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            // console.log("------- NOT FOUND TOKEN -------");
            req.loginSession = undefined;
        }
        else {
            let decoded = verify_token(token);
            if (decoded != null) {
                // console.log("------- SETTING loginSession -------");
                req.loginSession = decoded;
            }
            else {
                // console.log("------- INVALID TOKEN -------");
                req.loginSession = undefined;
            }
        }
        next();
    });
}
