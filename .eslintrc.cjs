/* eslint-.env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ["plugin:vue/vue3-recommended", "prettier"],
  plugins: ["vue", "html", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  rules: {
      "prettier/prettier": ['error', {endOfLine: 'auto'}],
  },
}
