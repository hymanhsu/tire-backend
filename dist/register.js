/**
 * Register our custom loader
 */
import 'data:text/javascript,import { register } from "node:module"';
import { pathToFileURL } from "node:url";
import { register } from 'node:module';
register("./dist/loader.js", pathToFileURL("./"));
