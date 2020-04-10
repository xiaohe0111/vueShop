import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "./plugins/elements.js";
// 导入字体图标样式
import "./assets/fonts/iconfont.css";

// 导入全局样式
import "./assets/css/public.css";
import TreeTable from "vue-table-with-tree-grid";

import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";

Vue.use(ElementUI);

// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 设置axios请求拦截
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须 return config
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);
// 定义一个全局过滤器组件
Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
