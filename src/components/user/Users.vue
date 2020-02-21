<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card>
      <!-- 搜索添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索用户，用双项绑定把输入的内容绑定到data的用户列表参数中，然后再执行拉取功能即可，寻找用户是后台的功能，前端无需管 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @input="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户显示区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 可以用slot scope 用scope来接受这一行的数据 有了插槽 就会覆盖prop -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="setForm(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              @click="deleteUser(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加用户 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="resetForm"
      >
        <el-form label-width="70px" :model="addForm" :rules="userFormRules" ref="addForm">
          <el-form-item prop="username" label="用户名">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input show-password v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFormUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户信息 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="setDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="resetFormTwo"
      >
        <el-form label-width="70px" :model="queryUser" ref="setForm" :rules="userFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="queryUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="queryUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="queryUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSetUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="setRoleDialogClosed"
      >
        <div>
          <p style="margin-bottom:20px">当前的用户：{{userInfo.username}}</p>
          <p style="margin-bottom:20px">当前的角色：{{userInfo.role_name}}</p>
          <p>{{rolesList.id}}</p>
          <p>
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { EOVERFLOW } from "constants";
export default {
  data() {
    // 自定义验证邮箱
    // 第一个参数是rules 第二个参数是当前input里代校验的value值 callback是通过 也就是边框变绿
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (regEmail.test(value)) {
        //   合法的邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      // 验证手机的正则表达式
      const regMobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (regMobile.test(value)) {
        //   正确是邮箱
        return callback();
      }
      callback(new Error("手机号错误，请重新输入。"));
    };
    return {
      // 获取用户列表的参数
      queryInfo: {
        //   query搜索用户
        query: "",
        // 当前第几页的页数
        pagenum: 1,
        // 一页显示几条数据
        pagesize: 5
      },
      // 当前的用户数据
      userList: [],
      //当前的用户列表总数
      total: 0,
      // 添加用户隐藏或显示
      dialogVisible: false,
      //   添加用户
      addForm: {
        username: "",
        password: "123456",
        email: "123@qq.com",
        mobile: "17601015631"
      },
      //   添加用的验证规则
      userFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //   控制修改用户信息显示或隐藏
      setDialogVisible: false,
      //   查询到的用户信息
      queryUser: [],
      // 分配角色对话框隐藏或显示
      setRoleDialogVisible: false,
      // 当前分配角色的信息
      userInfo: {},
      // 当前分配角色的所有角色列表
      rolesList: {},
      // 当前分配选中角色的对应id
      selectedRoleId: null
    };
  },
  created() {
    //   页面进来就获取用户列表
    this.getUserList();
  },
  methods: {
    //   获取列表
    async getUserList() {
      // params是get 自带的传递请求参数的方法，不能改
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });

      if (res.meta.status === 200) {
        this.userList = res.data.users;
        this.total = res.data.total;
        // this.$message.success(res.meta.msg);
      } else {
        return this.$message.error(res.meta.msg);
      }
    },
    // 监听每页条数发生改变
    handleSizeChange(newSizeChange) {
      // 每次条数发生变化，newSizeChange就是切换的条数值，把newSizeChange赋给获取参数从新拉取数据即可
      this.queryInfo.pagesize = newSizeChange;
      this.getUserList();
    },
    // 点击页码并发生切换时
    handleCurrentChange(newPage) {
      // 每次切换页码，newPage就是切换的页码数，把newPage赋给获取参数从新拉取数据即可
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 点击swiper开关 修改状态
    async userChange(steate) {
      const { data: res } = await this.$http.put(
        `users/${steate.id}/state/${steate.mg_state}`
      );
      if (res.meta.status !== 200) {
        // 如果操作失败 那就让当前的按钮恢复原样 取反即可
        steate.mg_state = !steate.mg_state;
        return this.$message.error("更新用户状态失败！");
      } else {
        this.$message.success(res.meta.msg);
      }
    },
    //添加用户
    addFormUser() {
      this.$refs.addForm.validate(async valid => {
        if (valid !== true) {
          return this.$message.error("有信息不合法，请重新规范填写");
        } else {
          const { data: res } = await this.$http.post("users", this.addForm);
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg);
          } else {
            // 添加成功关闭当前对话框
            this.dialogVisible = false;
            // 并且拉取最新用户列表
            this.getUserList();
            this.$message.success(res.meta.msg);
          }
        }
      });
    },
    // 关闭添加用户对话框 重置表单
    resetForm() {
      this.$refs.addForm.resetFields();
    },
    // 获取修改的用户信息
    async setForm(set) {
      // 根据id 查询用户信息
      const { data: res } = await this.$http.get(`users/${set}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      } else {
        this.queryUser = res.data;
        this.setDialogVisible = true;
      }
    },
    // 确认修改用户信息
    confirmSetUser() {
      // 表单预验证
      this.$refs.setForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("规格不合法，请重新输入");
        } else {
          // 预验证通过 发送修改请求
          const { data: res } = await this.$http.put(
            `users/${this.queryUser.id}`,
            {
              email: this.queryUser.email,
              mobile: this.queryUser.mobile
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          // 修改成功重新拉取更新数据
          this.$message.success(res.meta.msg);
          this.getUserList();
          this.setDialogVisible = false;
        }
      });
    },
    // 关闭修改用户信息对话框重置表单
    resetFormTwo() {
      this.$refs.setForm.resetFields();
    },
    // 删除功能
    deleteUser(id) {
      // 弹框询问用户是否删除
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 根据id删除对应的用户
          const { data: res } = await this.$http.delete(`users/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败，稍后再试！");
          } else {
            this.$message.success(res.meta.msg);
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.success(res.meta.msg);
      }
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 保存分配角色
    async saveRoleInfo() {
      if (this.selectedRoleId == null) {
        return this.$message.error("请选择分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.success(res.meta.msg);
      }
      // 重新刷新用户列表
      this.getUserList();
      this.$message.success(res.meta.msg);
      this.setRoleDialogVisible = false;
    },
    // 关闭分配角色把选中状态恢复默认
    setRoleDialogClosed() {
      this.selectedRoleId = null;
      this.userInfo = null;
    }
  }
};
</script>