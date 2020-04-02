module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
<<<<<<< HEAD
=======
    "space-before-function-paren": 0,
>>>>>>> 完成登录显示功能
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    quotes: [1, "single"],
    semi: ["error", "always"]
  }
};
