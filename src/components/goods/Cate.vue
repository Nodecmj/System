<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表单主体 -->
      <el-table :data="cateList" border>
        <!-- 进入二级扩展部分 -->
        <el-table-column type="expand" width="48px">
          <!-- 二级入口 -->
          <template slot-scope="scope">
            <!-- 二级表单主体 -->
            <el-table :show-header="false" class="el-table-two" :data="scope.row.children" border>
              <!-- 进入三级扩展部分 -->
              <el-table-column type="expand" width="48px">
                <!-- 三级入口 -->
                <template slot-scope="scope">
                  <!-- 三级表单主体 -->
                  <el-table class="el-table-two" :data="scope.row.children" :show-header="false">
                    <!-- 三级分类名称 -->
                    <el-table-column
                      prop="cat_name"
                      width="363px"
                      class-name="el-table-tow-padding el-table-three"
                    ></el-table-column>
                    <!-- 三级有效符号 -->
                    <el-table-column width="267px" prop="cat_deleted">
                      <template slot-scope="scope">
                        <i
                          :class="scope.row.cat_deleted!==false?'el-icon-success':'el-icon-error'"
                          :style="scope.row.cat_deleted!==false?'color:lightgreen':'color:red'"
                        ></i>
                      </template>
                    </el-table-column>
                    <!-- 三级排序 -->
                    <el-table-column width="267px" prop="cat_level">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                        <el-tag v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                      </template>
                    </el-table-column>
                    <!-- 三级操作 -->
                    <el-table-column width="266px" label="操作">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="mini"
                          @click="setCateInfo(scope.row)"
                        >编辑</el-button>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="removeCate(scope.row.cat_id)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <!-- 二级分类名称 -->
              <el-table-column prop="cat_name" width="315px" class-name="el-table-tow-padding"></el-table-column>
              <!-- 二级有效符号 -->
              <el-table-column width="267px" prop="cat_deleted">
                <template slot-scope="scope">
                  <i
                    :class="scope.row.cat_deleted!==false?'el-icon-success':'el-icon-error'"
                    :style="scope.row.cat_deleted!==false?'color:lightgreen':'color:red'"
                  ></i>
                </template>
              </el-table-column>
              <!-- 二级排序 -->
              <el-table-column width="267px" prop="cat_level">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                  <el-tag v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
                  <el-tag v-else type="warning">三级</el-tag>
                </template>
              </el-table-column>
              <!-- 二级操作 -->
              <el-table-column width="266px" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="setCateInfo(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeCate(scope.row.cat_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 一级index序号 -->
        <el-table-column type="index" label="#" width="48px"></el-table-column>
        <!-- 一级分类名称 -->
        <el-table-column prop="cat_name" label="分类名称" width="267px"></el-table-column>
        <!-- 一级有效符号 -->
        <el-table-column prop="cat_deleted" label="是否有效" width="267px">
          <template slot-scope="scope">
            <i
              :class="scope.row.cat_deleted!==false?'el-icon-success':'el-icon-error'"
              :style="scope.row.cat_deleted!==false?'color:lightgreen':'color:red'"
            ></i>
          </template>
        </el-table-column>
        <!-- 一级排序 -->
        <el-table-column prop="cat_level" label="排序" width="267px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <!-- 一级操作 -->
        <el-table-column width="267px" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="setCateInfo(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCate(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- page-size是默认显示5条 current-page是默认显示第几页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类谈话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="closedCateDialogVisible"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRls"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options用来指定数据源 props用来指定配置对象 -->
            <el-cascader
              :options="parentCateList"
              clearable
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChanged"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类谈话框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="setCateDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="closedSetCateDialogVisible"
      >
        <el-form
          :model="setCateForm"
          :rules="addCateFormRls"
          ref="setCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="setCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSetCateInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 商品分类的查询信息
      queryInfo: {
        // 详情请看电商管理后台API接口文档1.6.1
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页显示几条数据
        pagesize: 5
      },
      // 当前数据总数
      total: 0,
      // 添加分类谈话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        // 添加分类名字
        cat_name: "",
        // 添加分类父级id 详情看api文档1.6.2
        cat_pid: 0,
        // 分类等级 默认1级
        cat_level: 0
      },
      // 添加分类校验规则
      addCateFormRls: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 添加分类,父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 通过value指定具体选中的值的属性 比如那个值的唯一id 可以通过这个值来查询选中的那个具体数据
        value: "cat_id",
        // 通过label来指定你所看到的那个属性
        label: "cat_name",
        // 通过children来指定父子嵌套用的是哪个属性
        children: "children",
        // 触发类型 点击 或者划过
        expandTrigger: "hover",
        // 可以单选一项
        checkStrictly: true
      },
      // 级联选择中的父级id
      selectedKeys: [],
      // 修改分类名称的谈话框隐藏与显示
      setCateDialogVisible: false,
      // 修改分类名称的表单
      setCateForm: {
        cat_name: "",
        cat_id: ""
      }
    };
  },
  created() {
    // 一进页面就立马调用获取商品分类函数
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 获取成功
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 每页条数发生变化时
    handleSizeChange(sizeChange) {
      this.queryInfo.pagesize = sizeChange;
      this.getCateList();
    },
    // 页码发生变化时
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum;
      this.getCateList();
    },
    // 显示添加分类对话框
    showCateDialogVisible() {
      // 先获取父级分类数据
      this.getParentCateList();
      // 再显示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.parentCateList = res.data;
    },
    // 选项发生变化是触发这个函数
    parentCateChanged() {
      // 如果selectedKeys length大于0 就证明选了父级分类
      // 反之就说明没有选中任何父级分裂
      if (this.selectedKeys.length > 0) {
        // 给当前表单添加选中的父id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 根据选父级来分辨几级，0是一级 1是2级 2是3级，就是如果数组里有1个也就是只选中了一个父级
        // 那添加的这个类就是2级，直接就this.selectedKeys.length就行因为选中了一个 只有一个父级的id 所以length就是1,等级里面1代表的就是2级 以此类推
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // length小于或者=o就证明没有选中父级分类 那当前添加的分类就是最外层的父级 所以把id 和 等级都默认为0 最外层的父级分类就是0
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 确认添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) {
          return this.$message.error("请填写商品名称");
        } else {
          const { data: res } = await this.$http.post(
            "categories",
            this.addCateForm
          );
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success(res.meta.msg);
          // 重新拉取数据
          this.getCateList();
          // 关闭对话框
          this.addCateDialogVisible = false;
        }
      });
    },
    // 关闭分类对话框重置表单
    closedCateDialogVisible() {
      // 表单名字 pid level重置清空
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      // 级联选择器清空
      this.selectedKeys = [];
    },
    // 点击打开修改分类名称对话框
    setCateInfo(cateInfo) {
      this.setCateForm.cat_name = cateInfo.cat_name;
      this.setCateForm.cat_id = cateInfo.cat_id;
      this.setCateDialogVisible = true;
    },
    // 确认修改分类名触发的函数
    confirmSetCateInfo() {
      // 验证表单
      this.$refs.setCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写需修改的分类名");
        }
        const { data: res } = await this.$http.put(
          `categories/${this.setCateForm.cat_id}`,
          {
            cat_name: this.setCateForm.cat_name
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        console.log(res);
        this.getCateList();
        this.setCateDialogVisible = false;
      });
    },
    // 关闭修改分类触发函数 重置表单 信息
    closedSetCateDialogVisible() {
      this.$refs.setCateFormRef.resetFields();
      this.setCateForm.cat_name = "";
      this.setCateForm.cat_id = "";
    },
    // 删除分类
    removeCate(cat_id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${cat_id}`);
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error(res.mate.msg);
          }
          this.$message.success("删除成功");
          this.getCateList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.el-table-two {
  margin-top: 0;
}
.el-cascader {
  width: 100%;
}
</style>