<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开层 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="boxPad">
              <el-row
                :class="['el-row-bottom vcenter',index===0?'el-row-top':'']"
                v-for="(item1,index) in scope.row.children"
                :key="item1.id"
              >
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    v-for="(item2,index) in item1.children"
                    :key="item2.id"
                    :class="['vcenter',index===0?'':'el-row-top']"
                  >
                    <el-col :span="6">
                      <el-tag
                        closable
                        type="success"
                        @close="removeRightById(scope.row,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        closable
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="removeRightById(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              @click="setRoles(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              size="mini"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="colseDialog"
      >
        <el-form
          label-width="80px"
          :rules="rolesUserRules"
          :model="addRolesGroup"
          ref="addRolesRef"
        >
          <el-form-item prop="roleName" label="角色名称" pro>
            <el-input v-model="addRolesGroup.roleName"></el-input>
          </el-form-item>
          <el-form-item prop="roleDesc" label="角色描述">
            <el-input v-model="addRolesGroup.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改角色 -->
      <el-dialog
        title="修改角色"
        :visible.sync="setDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="colseDialogTwo"
      >
        <el-form label-width="80px" :rules="rolesUserRules" :model="queryRoles" ref="setRolesRef">
          <el-form-item prop="roleName" label="角色名称" pro>
            <el-input v-model="queryRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item prop="roleDesc" label="角色描述">
            <el-input v-model="queryRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDialogVisible">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加权限层 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @closed="colseRightDialog"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="giveRoleJurisdiction">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      dialogVisible: false,
      // 分配权限数据列表
      rightsList: [],
      // 分配权限显示或隐层
      setRightDialogVisible: false,
      // 树形控件的属性绑定对象
      treeProps: {
        // 每个权限名的名字
        label: "authName",
        // 二级三级等用的名字
        children: "children"
      },
      // 已有权限的对应数组
      defKeys: [],
      //   添加角色
      addRolesGroup: {
        roleName: "",
        roleDesc: ""
      },
      //   检测规则
      rolesUserRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      //   拉取并且编辑的角色信息
      queryRoles: {
        roleName: "",
        roleDesc: ""
      },
      setDialogVisible: false,
      // 当前分配角色id
      roleId: null
    };
  },
  created() {
    //   获取角色列表
    this.getRolesList();
  },
  methods: {
    //   获取列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.rolesList = res.data;
      }
    },
    // 添加角色
    addRoles() {
      // 表单预验证
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写完整信息");
        }
        // 表单验证通过，可以请求添加数据
        const { data: res } = await this.$http.post(
          "roles",
          this.addRolesGroup
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        } else {
          this.dialogVisible = false;
          this.getRolesList();
          this.$message.success(res.meta.msg);
        }
      });
    },
    // 关闭添加弹框，重置表单验证
    colseDialog() {
      this.$refs.addRolesRef.resetFields();
    },
    // 删除角色
    async deleteRoles(id) {
      // 弹框询问用户是否删除
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 根据用户id删除
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getRolesList();
          this.$message.success(res.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑角色框弹出
    async setRoles(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.setDialogVisible = true;
        this.queryRoles = res.data;
      }
    },
    // 关闭修改弹框，重置表单验证
    colseDialogTwo() {
      this.$refs.setRolesRef.resetFields();
    },
    // 修改信息
    confirmDialogVisible() {
      // 预验证表单
      this.$refs.setRolesRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("内容不能为空，请填写完整");
        } else {
          const { data: res } = await this.$http.put(
            `roles/${this.queryRoles.roleId}`,
            {
              roleName: this.queryRoles.roleName,
              roleDesc: this.queryRoles.roleDesc
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          } else {
            this.setDialogVisible = false;
            this.$message.success("修改完成");
            this.getRolesList();
          }
        }
      });
    },
    // 删除权限
    removeRightById(role, rightId) {
      this.$confirm("此操作删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          } else {
            // 这一步是让该角色下的权限数据重新赋值拉取最新数据，因为返回的res.data是最新的权限数据 直接局部覆盖即可
            role.children = res.data;
            this.$message.success("取消权限成功！");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 展示分配权限层
    async showSetRightDialog(role) {
      // 当前角色id赋给data角色id属性
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      this.rightsList = res.data;
      // 用递归获取所有的三级节点id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前的node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      // forEach循环 item是node.children的每个对象 然后继续运行这个方法，直到没有children为止 并且把所有选中的id都保存在arr数组总
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 关闭当前分配权限层时 defKeys 数组清空
    colseRightDialog() {
      this.defKeys = [];
    },
    // 分配角色权限
    async giveRoleJurisdiction() {
      // keys是获取当前选中的属性节点的id 用展开运算符直接把数组放在新数组里合并
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ];
      // 因为接口api的参数需要把id数组转换成以逗号分开的字符串 所以需要这一步
      console.log(this.roleId);
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      // 从新刷新数据列表
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.el-row-top {
  border-top: 1px solid #eee;
}
.el-row-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
</style>