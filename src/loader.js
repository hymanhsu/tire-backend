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

import resolveCallback from 'resolve/async.js';

const resolveAsync = promisify(resolveCallback);

const baseURL = pathToFileURL(cwd() + '/').href;


export async function resolve(specifier, context, next) {
  const { parentURL = baseURL } = context;

  if (isBuiltin(specifier)) {
    return next(specifier, context);
  }

  // `resolveAsync` works with paths, not URLs
  if (specifier.startsWith('file://')) {
    specifier = fileURLToPath(specifier);
  }
  const parentPath = fileURLToPath(parentURL);

  let url;
  try {
    const resolution = await resolveAsync(specifier, {
      basedir: dirname(parentPath),
      // For whatever reason, --experimental-specifier-resolution=node doesn't search for .mjs extensions
      // but it does search for index.mjs files within directories
      extensions: ['.js', '.json', '.node', '.mjs'],
    });
    url = pathToFileURL(resolution).href;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      // Match Node's error code
      error.code = 'ERR_MODULE_NOT_FOUND';
    }
    throw error;
  }

  return next(url, context);
}