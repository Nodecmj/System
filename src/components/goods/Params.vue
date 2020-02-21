<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="el-row-martop">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="cateChanged"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 选项卡区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <!-- 添加动态参数按钮 -->
              <el-button
                type="primary"
                :disabled="selectedKeys.length !== 3?true:false"
                @click="addDialogVisible=true"
              >添加参数</el-button>
            </el-col>
          </el-row>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="boxPad">
                  <el-tag
                    v-for="(vals,index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="deletaTag(scope.row,index)"
                  >{{vals}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <!-- 表格索引 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showSetForm(scope.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <!-- 添加静态属性按钮 -->
              <el-button
                type="primary"
                :disabled="selectedKeys.length !== 3?true:false"
                @click="addDialogVisible=true"
              >添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="boxPad">
                  <el-tag
                    v-for="(vals,index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="deletaTag(scope.row,index)"
                  >{{vals}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <!-- 表格索引 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showSetForm(scope.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加谈话框 -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="addDialogClosed"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addRuleForm" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="setDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="setDialogClosed"
      >
        <el-form :model="setForm" :rules="addFormRules" ref="setRuleForm" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="setForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSetForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 选中的分类id组
      selectedKeys: [],
      // 分类数据源
      cateList: [],
      //   级联选择器配置 对象
      cascaderProps: {
        //   触发方式
        expandTrigger: "hover",
        // 通过什么选现识别选中的项
        value: "cat_id",
        // 展示的文字
        label: "cat_name",
        // 对象包含子对象的名字
        children: "children"
      },
      //  选项卡被激活的页签的名称
      activeName: "many",
      //   静态属性的数据
      onlyTableData: null,
      // 动态参数的数据
      manyTableData: null,
      // 添加静态属性/动态参数 隐藏与显示对话框
      addDialogVisible: false,
      // 表单
      addForm: {
        attr_name: ""
      },
      // 表单验证
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名", trigger: "blur" }
        ]
      },
      // 修改表单对话框隐藏显示
      setDialogVisible: false,
      // 修改表单
      setForm: {
        attr_name: ""
      }
      // // 输入框和按钮切换显示
      // inputVisible: false,
      // // 添加字段输入框双向绑定
      // inputValue: ""
    };
  },
  created() {
    //   调用获取商品分类数据源
    this.getCateList();
  },
  methods: {
    //   获取商品分类级联数据源
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data;
    },
    // 判断级联选择器是否选择的是三级分类 然后请求数据
    async cateChanged() {
      // 证明没有选中三级分类
      if (this.selectedKeys.length !== 3) {
        this.manyTableData = null;
        this.onlyTableData = null;
        this.selectedKeys.length = [];
        return;
      }
      //   选中了三级分类
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 把字符串以空格分割成数组
      res.data.forEach(item => {
        // 如果vals为空 那么就赋值空数组。如果不为空 那就分割字符串
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 为了让每组的互不干扰 给每个单独增加显示隐藏切换 和vmodel绑定
        item.inputVisible = false;
        item.inputValue = "";
      });
      // console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 选项卡点击事件发生的函数
    handleTabClick() {
      // 切换选项卡重新请求对应数据
      this.cateChanged();
      //   console.log(this.activeName);
    },
    // 关闭谈话框重置表单
    addDialogClosed() {
      this.$refs.addRuleForm.resetFields();
    },
    // 确认提交表单
    confirmAddForm() {
      // 预验证
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写参数名");
        }
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.cateChanged();
        this.addDialogVisible = false;
      });
    },
    // 修改参数信息对话框
    async showSetForm(info) {
      // 从服务器根据id查询对应数据，从服务器获取数据然后赋给修改表单
      const { data: res } = await this.$http.get(
        `categories/${info.cat_id}/attributes/${info.attr_id}`,
        {
          params: { sel: this.activeName }
        }
      );
      // console.log(res);
      this.setForm = res.data;
      this.setDialogVisible = true;
    },
    // 关闭修改谈话框重置表单
    setDialogClosed() {
      this.$refs.setRuleForm.resetFields();
    },
    // 提交修改信息对话框
    confirmSetForm() {
      // 表单验证
      this.$refs.setRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写参数名");
        } else {
          const {
            data: res
          } = await this.$http.put(
            `categories/${this.setForm.cat_id}/attributes/${this.setForm.attr_id}`,
            { attr_name: this.setForm.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success(res.meta.msg);
          this.cateChanged();
          this.setDialogVisible = false;
        }
      });
    },
    // 删除参数
    deleteParams(info) {
      // console.log(info);
      this.$confirm("此操作将永久删除属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${info.cat_id}/attributes/${info.attr_id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.$message.success(res.meta.msg);
          // 重新拉取数据
          this.cateChanged();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加字段文本框按下enter或者失去焦点运行函数
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return 则证明内容需要做后续处理
      row.attr_vals = [...row.attr_vals, row.inputValue.trim()];
      row.inputValue = "";
      row.inputVisible = false;
      // 发起网络修改请求 吧tag标签修改的信息保存在服务器中
      this.saveAttrVals(row);
    },
    // 将attr_vals修改的信息保存在服务器中
    async saveAttrVals(row) {
      // 发起网络请求 吧标签保存在服务器中或者删除
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    // 添加字段按钮 显示文本框
    showInput(row) {
      row.inputValue = "";
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick方法的作用 就是当页面上元素被重新渲染之后才会只会执行回调函数的代码
      // 意思就是 如果直接让文本框显示然后立马获取文本框焦点this.$refs.saveTagInput.$refs.input.focus(); 当前的页面input其实还没有被渲染出来 找不到这个input，所以会报错。$nextTick是让inputVisible=true 显示文本框之后 然后等新出现的dom渲染完成才会执行的回调，也就是有顺序的 你只有input正式渲染完才会运行此回调。然后获取当前新增加的dom input就不会报错了
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除tag字段
    deletaTag(row, index) {
      // 删除对应index的tag标签
      row.attr_vals.splice(index, 1);
      // 把修改的attr_vals信息保存在服务器中
      this.saveAttrVals(row);
    }
  },
  computed: {
    //   获取三级分类的id
    getCateId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    // 对话框动态title
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-row-martop,
.el-tabs {
  margin-top: 20px;
}
.el-cascader {
  width: 30%;
}
.input-new-tag {
  width: 120px;
}
.el-tag {
  margin: 10px;
}
</style>