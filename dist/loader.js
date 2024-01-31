var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * The custom loader
 * Ref : https://nodejs.org/api/esm.html#loaders
 * https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader
 * usage : node --import ./dist/register.js ./dist/index.js
 * Code example :
 * when write :
 * import { heloRouter } from './api/helo/helo1';
 * .....
 * our custom loader will load './api/helo/helo1.js' automatically :-)
 *
 * NOTE:
 * if you don't use register : node --loader=./dist/loader.js ./dist/index.js
 * Node.js will reminder you with one warning :
 * (node:9564) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
*  --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("./dist/loader.js", pathToFileURL("./"));'
 * (Use `node --trace-warnings ...` to show where the warning was created)
 */
import { isBuiltin } from 'node:module';
import { dirname } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
// import path from 'path';
// import { fileURLToPath } from 'url';
import resolveCallback from 'resolve/async.js';
const resolveAsync = promisify(resolveCallback);
const baseURL = pathToFileURL(cwd() + '/').href;
export function resolve(specifier, context, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parentURL = baseURL } = context;
        // console.log("specifier="+specifier);
        if (isBuiltin(specifier)) {
            return next(specifier, context);
        }
        // console.log("baseURL="+baseURL);
        if (specifier.startsWith("@App")) {
            specifier = specifier.replace("@App", baseURL + "dist");
        }
        // `resolveAsync` works with paths, not URLs
        if (specifier.startsWith('file://')) {
            specifier = fileURLToPath(specifier);
        }
        const parentPath = fileURLToPath(parentURL);
        let url;
        try {
            const resolution = yield resolveAsync(specifier, {
                basedir: dirname(parentPath),
                // For whatever reason, --experimental-specifier-resolution=node doesn't search for .mjs extensions
                // but it does search for index.mjs files within directories
                extensions: ['.js', '.json', '.node', '.mjs'],
            });
            url = pathToFileURL(resolution).href;
        }
        catch (error) {
            console.log(error);
            if (error.code === 'MODULE_NOT_FOUND') {
                // Match Node's error code
                error.code = 'ERR_MODULE_NOT_FOUND';
            }
            throw error;
        }
        return next(url, context);
    });
}
