// {
//     "root": true,
//     "extends": [
//         "eslint:recommended",
//         "plugin:@typescript-eslint/recommended"
//     ],
//     "parser": "@typescript-eslint/parser",
//     "parserOptions": { "project": ["./tsconfig.json"] },
//     "plugins": [
//         "@typescript-eslint"
//     ],
//     "rules": {
//         "@typescript-eslint/strict-boolean-expressions": [
//             2,
//             {
//                 "allowString" : false,
//                 "allowNumber" : false
//             }
//         ]
//     },
//     "ignorePatterns": ["src/**/*.test.ts", "src/scripts/*"]
// }

// npm i eslint-import-resolver-alias -D
const path = require("path");
module.exports = {
  //...
  settings: {
    'import/resolver': {
      alias: {
        map: [['@App', path.resolve(__dirname, 'src')]],
      },
    },
  },
};
