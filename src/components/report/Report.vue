<template>
  <div>
    <!-- 面包屑模块 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片模块 -->
    <el-card>
      <!-- 第二步为echarts准备一个具备打下的dom -->
      <div id="main" style="width:750px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
// 第一步导入echarts
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  //   页面的元素需要被加载完后再进行渲染
  async mounted() {
    //   3,初始化echarts
    var myChart = echarts.init(document.getElementById("main"));
    // 发送请求
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败");
    }
    // 4,准备数据和配置项
    const result = _.merge(res.data, this.options);
    // 5,使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods: {}
};
</script>

<style lang="less" scoped></style>
