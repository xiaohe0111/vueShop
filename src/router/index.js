import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/user/Users.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },

  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/users", component: Users },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params }
    ]
  }
];

const router = new VueRouter({
  routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示要访问的路径 from表示从哪个路径跳转而来 next是一个函数表示放行
  if (to.path === "/login") {
    next();
  } else {
    // 如果用户访问的不是登录页面那么久获取到token的数据然后把页面强制跳转到/login页面
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      // 如果有token数据就放行
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
