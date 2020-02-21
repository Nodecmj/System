<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="picture">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578479581523&di=ad1286966f080d7780352093d4bbd588&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F63f4ccdc8d434b6f2972fa8f9f5bf9e91c454556.jpg"
          alt
        />
      </div>
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="loginForm">
        <el-form-item prop="userName">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="buts">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单登录验证规则
      loginFormRules: {
        // 用户名验证规则
        username: [
          // required必填项 message提示 trigger鼠标移开时 min最小长度 max最大长度
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 用户密码验证规则
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 预验证 点击登录验证是否符合
    login() {
      // validate是element ui form的一个方法，对整个表单进行校验的方法 第一个参数valid(随便写，不过语义一下 一般都写valid) 读音：w发震然后歪累的 返回布尔 是否符合定义的验证规则
      this.$refs.loginFormRef.validate(async valid => {
        if (valid == true) {
          // {data:res} 这个是解构，data就是获取到的数据下面的data对象，：后面的res就是把data赋值给名字为res的变量 其实意思和res=await this.$http.post("XXX"); console.log(res.data) 意思相同
          // await只能用在async修饰的方法中，所以必须给valid这个箭头函数前面加上异步方法async
          const { data: res } = await this.$http.post("/login", this.loginForm);
          if (res.meta.status == 200) {
            this.$message.success("登录成功！");
            //1.登录成功之后的token，保存到客户端的sessionStorage中
            // 1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
            // 1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage中
            window.sessionStorage.setItem("token", res.data.token);
            // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
            this.$router.push("/home");
          } else {
            this.$message.error("登录失败，密码错误！");
          }
        }
      });
    },
    resetLoginForm() {
      // 重置表单
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  float: left;
  position: relative;
  width: 100%;
  height: 100%;
  background: #2b4b6b;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 3px;
  .picture {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 5px solid #fff;
    padding: 1px;
    overflow: hidden;
    box-shadow: 0 0 10px #ddd;
    img {
      position: absolute;
      top: -10%;
      width: 100%;
    }
  }
  .loginForm {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .buts {
    text-align: right;
  }
}
</style>