<template>
  <div>
    <el-button @click="loginout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    loginout() {
      // 清除token的数据
      window.sessionStorage.clear();
      // 然后将页面重新跳转到登录页面
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped></style>
