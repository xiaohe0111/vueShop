import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "./plugins/elements.js";
// 导入字体图标样式
import "./assets/fonts/iconfont.css";

// 导入全局样式
import "./assets/css/public.css";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
