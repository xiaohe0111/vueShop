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
axios.interceptors.request.use((config) => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须 return config
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
