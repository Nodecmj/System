<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索添加订单列表区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索用户，用双项绑定把输入的内容绑定到data的用户列表参数中，然后再执行拉取功能即可，寻找用户是后台的功能，前端无需管 -->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @change="getOrdersList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 添加商品列表 -->
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgRessBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 显示修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addRessDialogVisible"
      width="50%"
      @closed="closeAddRessDialogVisibel"
    >
      <el-form
        :model="addRessForm"
        :rules="addRessFormRules"
        ref="addRessFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydData" v-model="addRessForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addRessForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRessDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRessDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="progRessDialogVisible" width="50%">
      <el-table :data="progressInfo" border>
        <el-table-column label="发货时间" prop="time"></el-table-column>
        <el-table-column label="地点" prop="context"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import citydData from "./citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: 0,
      addRessDialogVisible: false,
      addRessForm: {
        address1: [],
        address2: ""
      },
      addRessFormRules: {
        address1: [
          { required: true, message: "请输入省市区县", trigger: "blur" }
        ],
        address2: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      citydData,
      progRessDialogVisible: false,
      progressInfo: []
    };
  },
  created() {
    //   调用获取数据函数
    this.getOrdersList();
  },
  methods: {
    //   获取订单列表数据
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.total = res.data.total;
      this.ordersList = res.data.goods;
    },
    // 分页条数化的时候触发函数
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize;
      this.getOrdersList();
    },
    // 页码发生变化触发函数
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum;
      this.getOrdersList();
    },
    // 显示修改地址对话框
    showBox() {
      this.addRessDialogVisible = true;
    },
    // 关闭对话框重置表单验证
    closeAddRessDialogVisibel() {
      this.$refs.addRessFormRef.resetFields();
    },
    // 显示物流进展对话框
    async showProgRessBox() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      }
      this.progressInfo = res.data;
      this.progRessDialogVisible = true;
      console.log(this.progressInfo);
    }
  }
};
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>