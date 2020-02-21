<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索用户，用双项绑定把输入的内容绑定到data的用户列表参数中，然后再执行拉取功能即可，寻找用户是后台的功能，前端无需管 -->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @change="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 添加商品列表 -->
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表单区域 -->
      <el-table :data="tableData" border stripe style="width: 100%">
        <!-- index -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column prop="goods_name" label="商品名称" width="614"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <!-- 商品重量 -->
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" width="172">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="121">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表单分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
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
      // 商品列表数据
      tableData: [],
      //   查询信息
      queryInfo: {
        // 商品名字
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },
      //   总数居条数
      total: 0
    };
  },
  created() {
    //   调用获取商品列表函数
    this.getGoodsList();
  },
  methods: {
    //   获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.tableData = res.data.goods;
      this.total = res.data.total;
    },
    // 分页功能
    // 当每页条数变动时触发
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize;
      this.getGoodsList();
    },
    // 每页发生变化时触发
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum;
      this.getGoodsList();
    },
    // 删除
    removeById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success(res.meta.msg);
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 按添加按钮跳转到添加路由
    goAddPage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>
<style lang="less" scoped>
</style>