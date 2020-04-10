<template>
  <div>
    <!-- 面包屑模块 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片模块 -->
    <el-card>
      <!-- 信息警告区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 商品上传进度条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="addForm.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input v-model="addForm.goodsPrice" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goodsWeight">
              <el-input v-model="addForm.goodsWeight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goodsNumber">
              <el-input v-model="addForm.goodsNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goodsCat">
              <el-cascader
                v-model="addForm.goodsCat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单项的item -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attrVals">
                <el-checkbox :label="cb" v-for="(cb,index) in item.attrVals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      tabPosition: "left",
      // 添加商品的数据
      addForm: {
        goodsName: "",
        goodsPrice: 0,
        goodsWeight: 0,
        goodsNumber: 0,
        // 商品的数据分类
        goodsCat: []
      },
      // 添加商品数据的验证规则
      addFormRules: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goodsPrice: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goodsWeight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goodsNumber: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goodsCat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 获取商品分类的数据
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态数据列表参数
      onlyTableData: [],
      // action的路径上传的url地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload"
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      // 获取所以的商品分类
      const { data: res } = await this.$http.get("categories");
      // 然后对状态进行判断
      if (res.meta.status !== 200) {
        // 就说明获取商品数据列表失败
        return this.$message.error("获取商品数据失败");
      }
      // 反之就是获取成功
      this.$message.success("获取商品数据成功");
      this.catelist = res.data;
      console.log(res.data);
    },
    // 级联选择器选项发生变化触发的函数
    handleChange() {
      console.log(this.addForm.goodsCat);
      // 这里我们对选择的级联进行判断,要求只能选择三级级联,如果不是就清空
      // 控制级联选择器的选择范围
      if (this.addForm.goodsCat.length !== 3) {
        this.addForm.goodsCat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log("即将离开的标签页名字是：" + oldActiveName);
      // console.log("即将离开的标签页名字是：" + activeName);
      // 然后对goodsCat的长度进行判断
      if (oldActiveName === "0" && this.addForm.goodsCat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    async tabClicked() {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败！");
        }

        console.log(res.data);
        res.data.forEach(item => {
          item.attrVals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态参数列表失败！");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览的函数
    handlePreview() {},
    // 处理移除图片的操作
    handleRemove() {}
  },
  // 定义计算属性
  computed: {
    cateId() {
      if (this.addForm.goodsCat.length === 3) {
        return this.addForm.goodsCat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
</style>
