<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <!-- tabs标签 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          @tab-click="tabClicked"
          :before-leave="beforeTableLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 输入商品名称 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- 输入商品价格 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <!-- 输入商品重量 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <!-- 输入商品数量 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <!-- 商品分类选择 -->
            <el-form-item label="商品分类" prop="goods_cat_Copy">
              <el-cascader
                v-model="addForm.goods_cat_Copy"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到后台的API地址 -->
            <!-- list-type 是显示的类型 拖拽 图片缩略图 只显示文件名等 -->
            <!-- 因为upload上传时内封装的axios 所以没有给请求头添加token，可以用:headers给数据请求增加请求头token-->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 附文本组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //   验证价格
    var verifyPrice = (rules, value, callback) => {
      const viyNumber = /^\d+$|^\d+[.]?\d+$/;
      if (viyNumber.test(value)) {
        return callback();
      }
      callback(new Error("内容只能是数字，请重新输入！"));
    };
    // 验证选中分类
    var verify_cat = (rules, value, callback) => {
      if (this.addForm.goods_cat_Copy.length === 3) {
        return callback();
      } else {
        callback(new Error("请选择三级分类！"));
      }
    };
    return {
      // 步骤条的index
      activeIndex: "0",
      //   商品分类数据源
      cateList: [],
      //   添加表单
      addForm: {
        //   商品名称
        goods_name: "",
        // 商品价格
        goods_price: "",
        // 商品重量
        goods_weight: "",
        // 商品数量
        goods_number: "",
        // 商品分类id
        // copy是因为级联选择器只能是数组 如果转化成字符串会报错，所以只是最后提交数据的时候把真正的cat转换成字符串 copy还是数组这样就不会报错了
        goods_cat_Copy: "",
        goods_cat: "",
        // 上传图片的数组
        pics: [],
        // 商品介绍
        goods_introduce: "",
        // 商品参数
        attrs: ""
      },
      // 验证表单
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { validator: verifyPrice }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { validator: verifyPrice }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { validator: verifyPrice }
        ],
        goods_cat_Copy: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
          { validator: verify_cat }
        ]
      },
      // 级联选择器的的props
      cascaderProps: {
        value: "cat_id",
        expandTrigger: "hover",
        label: "cat_name",
        children: "children"
      },
      //   动态参数表格数据
      manyTableData: [],
      //   静态属性表格数据
      onlyTableData: [],
      //   上传图片后台的api地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      //   大图地址
      previewPath: "",
      //   大图显示隐藏对话框
      previewDialogVisible: false,
      //   校验必填项是否合法
      Valid: null
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data;
    },
    //   选项卡切换触发
    async tabClicked() {
      //   如果是动态参数页面tab
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        //   静态属性页面获取数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.onlyTableData = res.data;
      }
    },
    // 级联选择器发生变化触发
    handleChange() {
      if (this.addForm.goods_cat_Copy.length !== 3) {
        this.addForm.goods_cat_Copy = [];
        this.addForm.goods_cat = [];
      }
      this.addForm.goods_cat = this.addForm.goods_cat_Copy;
    },
    // 切换守卫
    beforeTableLeave(activeName, oldActiveName) {
      //   console.log("即将离开的标签页名字是：" + oldActiveName);
      //   console.log("即将进入的标签页名字是：" + activeName);
      //   return false;
      this.$refs.addFormRef.validate(valid => {
        this.Valid = valid;
      });
      //   验证必填项全部填完才能下一步
      if (oldActiveName === "0" && this.Valid === false) {
        this.$message.error("请填写必填项！");
        return false;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      // 把图片的url地址赋给显示大图url
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },
    // 处理删除图片的操作
    handleRemove(file) {
      // 1.获取删除的图片的临时地址
      const filePath = file.response.data.tmp_path;
      //   2.从pic数组中，找到这个图片对应的索引值
      const index = this.addForm.pics.findIndex(item => {
        return item.pic === filePath;
      });
      //   3.调用数组的splice方法，把图片信息对象，从pics数组中删除
      this.addForm.pics.splice(index, 1);
    },
    //   监听图片上传成功的事件
    handleSuccess(response) {
      //1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //2. 将图片信息push到pics数组中
      this.addForm.pics = [...this.addForm.pics, picInfo];
    },
    // 添加商品
    async addGoods() {
      //防止连续快速点击两次确定键，然后连续转换数据类型而报错
      if (typeof this.addForm.goods_cat !== "string") {
        // 把分类id从数组转换成字符串
        this.addForm.goods_cat = this.addForm.goods_cat.join(",");
      }
      //   处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" ")
        };
        this.addForm.attrs = [...this.addForm.attrs, newInfo];
      });
      //   处理静态属性
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
        this.addForm.attrs = [...this.addForm.attrs, newInfo];
      });
      // 数据请求 往服务器发送添加数据
      const { data: res } = await this.$http.post("goods", this.addForm);
      console.log(res);
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("添加成功！");
      this.$router.push("/goods");
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat_Copy.length == 3) {
        return this.addForm.goods_cat_Copy[2];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>