<template>
  <div>
      <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!--表格占位-->
        <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeCateById(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>

        <!--分页区域-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed" >
      <!--添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <!-- options用来指定数据源 -->
            <!-- props用来指定配置对象 -->
            <el-cascader  v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable ></el-cascader>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%"  @close="editCateDialogClosed">
      <el-form ref="editCateFormRef" :model="editCateForm" label-width="70px" :rules="editCateFormRules">
        <el-form-item label="用户名">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表默认为空
      catelist: [],
      // 总的数据条数
      total: 0,
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示将当前列定义为模版别
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        // 表示将当前列定义为模版别
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        // 表示将当前列定义为模版别
        type: 'template',
        template: 'opt'
      }],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
        checkStrictly: true,
        children: 'children'
      },
      // 选中的父级分类id的数组
      selectedKeys: [],
      // 控制修改分类对话框显示
      editCateDialogVisible: false,
      // 查询分类信息对象
      editCateForm: {},
      // 修改表单的验证规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入需要修改的分类', trigger: 'blur' }, { min: 2, max: 10, message: '用户名的长度在2~10个字符之间', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getCatelist();
  },
  methods: {
    // 获取商品分类的数据
    async getCatelist () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败');
      }
      // 把数据列表赋值给catelist
      this.catelist = res.data.result;
      // 为总的数据条数赋值
      this.total = res.data.total;
    },
    // 分页功能实现
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCatelist();
    },
    // 监听 Pagenum 的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCatelist();
    },
    // 点击按钮显示添加分类的对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCatelist();
      // 再展示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCatelist () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败');
      }
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys);
      // 如果selectedKeys的length大于0说明选中了父级分类
      if (this.selectedKeys > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('categories', this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类信息失败');
        }
        this.$message.success('添加分类成功');
        this.getCatelist();
        this.addCateDialogVisible = false;
      });
    },
    // 监听对话框的关闭
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 展示编辑分类的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id);

      if (res.meta.status !== 200) { return this.$message.error('查询分类信息失败'); }

      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    // 重置编辑分类对话框
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields();
    },
    // 修改分类信息并提交
    editCateInfo () {
      // 看看预校验是否通过
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
        // 发起用户修改请求
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name });
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类失败');
        }
        // 关闭对话框
        this.editCateDialogVisible = false;
        // 刷新数据列表
        this.getCatelist();
        // 提示修改成功
        this.$message.success('更新分类信息成功');
      });
    },
    // 根据id删除分类信息
    async removeCateById (id) {
      // 询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 如果用户确认删除返回confirm字符串,如果用户点击取消返回cancel字符串
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经为您取消了本次操作！');
      }
      const { data: res } = await this.$http.delete('categories/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败!');
      }
      this.$message.success('删除分类成功');
      // 刷新分类列表
      this.getCatelist();
    }
  }
};
</script>
<style scoped lang='less'>
.treeTable {
  margin-top: 15px;
}
</style>
