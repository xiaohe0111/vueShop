<template>
  <div>
    <!-- 面包屑模块 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片模块 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品的table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 12, 15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品的数据
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      // 然后进行判断
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      // 否则就提示正确信息
      this.$message.success("获取商品列表成功！");
      console.log(res.data);
      //   然后进行数据渲染
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    // 当pagesize发生变化触发的函数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    // 当pagenum当前页发生变化时触发的函数
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getGoodsList();
    },
    // 根据ID删除当前商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //   然后对结果进行判断
      if (confirmResult !== "confirm") {
        //  如果不等confirm就表明用户不想删除
        return this.$message.info("已经取消删除！");
      }
      //   如果结果等于confirm就表明用户确实要删除数据
      const { data: res } = await this.$http.delete(`goods/${id}`);

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！");
      }

      this.$message.success("删除成功！");
      this.getGoodsList();
    },
    // 点击添加商品按钮进行跳转
    goAddpage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
