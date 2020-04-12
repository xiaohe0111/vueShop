/* eslint-disable camelcase */
/* eslint-disable camelcase */
<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!-- 头部警告 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            class="myCascader"
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!--tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableDate" border stripe>
            <el-table-column label="展开" type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close= "handleClose(i,scope.row)" >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
           <!--静态属性表格-->
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column label="展开" type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close= "handleClose(i,scope.row)" >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
        <!-- 添加参数的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
    // 商品分类列表
      catelist: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
        children: 'children'
      },
      // 级联双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableDate: [],
      // 静态参数的数据
      onlyTableDate: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getCsteList();
  },
  methods: {
    // 获取所有的商品分类
    async getCsteList () {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表信息失败');
      }
      this.catelist = res.data;
    },
    // 这是tab页签的点击事件处理函数
    handleTabClick () {
      console.log(this.activeName);
      this.getParamsData();
    },
    // 获取参数的列表数据
    async handleChange () {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData () {
      // 级联选择款变化会触发的函数
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableDate = [];
        this.onlyTableDate = [];
        return;
      }
      // 根据当前的id以及所处的面板获取对应的数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败');
      }

      res.data.forEach(item => {
        // 本来是一个字符串经过这次循环后变成了一个数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = '';
      });
      console.log(res.data);

      if (this.activeName === 'many') {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    // 监听添加对话框的关闭
    addDialogClosed () {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName });
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败');
        }
        this.$message.success('添加参数成功');
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 点击按钮展示修改的对话框
    // eslint-disable-next-line camelcase
    async showEditDialog (attr_id) {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } });
      if (res.meta.status !== 200) {
        return this.$message.error('请求参数信息失败');
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 重置编辑表单的操作
    editDialogClosed () {
      this.$refs.editFormRef.resetFields();
    },
    // 点击按钮修改参数信息
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName });
        if (res.meta.status !== 200) {
          return this.$message.error('请求修改参数失败');
        }
        this.$message.success('修改参数成功');
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 根据id删除对应的配置项
    // eslint-disable-next-line camelcase
    async removeParams (attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了本次操作');
      }
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败');
      }
      this.$message.success('删除参数成功');
      this.getParamsData();
    },
    // 文本框失去焦点或按下enter触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入了内容，需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    // 将 attr_vals 的操作保存到数据库
    async saveAttrVals (row) {
      // 需要发起请求保存这次参数
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') });
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败');
      }
      this.$message.success('修改参数项成功');
    },

    // 点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用,就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对用的可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },
  computed: {
    // 如果按钮被禁用返回true否者返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 这是当前选中的三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 标题变换
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数';
      } else {
        return '静态属性';
      }
    }
  }
};
</script>
<style scoped lang='less'>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 150px;
  margin: 10px;
}
</style>
