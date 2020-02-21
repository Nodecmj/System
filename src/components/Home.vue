<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/image/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' :'200px'">
        <div class="Fold" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="SelectionNav"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menuList.id + ''" v-for="menuList in menuList" :key="menuList.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icon[menuList.id]"></i>
              <!-- 文本 -->
              <span>{{menuList.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+menuChil.path + ''"
              v-for="menuChil in menuList.children"
              :key="menuChil.id"
              @click="calledNav('/'+menuChil.path)"
            >
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{menuChil.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 想让路由有过渡动画，需要在<router-view>标签的外部添加<transition>标签， -->
        <!-- 孤独模式 mode：mode的模式是in-out模式和out-in两种模式 -->
        <!--   1.in-out:新元素先进入过渡，完成之后当前元素过渡离开。
        2.out-in:当前元素先进行过渡离开，离开完成后新元素过渡进入。-->
        <transition name="fade" mode="out-in">
          <!-- <router-view style="position:absolute;" /> -->
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 是否折叠
      isCollapse: false,
      // 左侧菜单数据
      menuList: [],
      icon: {
        "125": "el-icon-user",
        "103": "el-icon-postcard",
        "101": "el-icon-goods",
        "102": "el-icon-tickets",
        "145": "el-icon-reading"
      },
      // 菜单高亮
      SelectionNav: ""
    };
  },
  created() {
    // 进页面就获取导航数据
    this.getMenuList();
    // 获取储存在sessionStorage的nav高亮path 然后赋给el-menu的:default-active 让选中项保持高亮
    this.SelectionNav = window.sessionStorage.getItem("select");
  },
  methods: {
    // 获取导航数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      } else {
        this.menuList = res.data;
      }
    },
    //   退出登陆
    logout() {
      // 删除token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    calledNav(select) {
      // 把导航栏选中的那一项储存在sessionStorage里面 就算刷新页面 选中的导航依旧高亮
      window.sessionStorage.setItem("select", select);
      this.SelectionNav = select;
    }
  }
};
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #363d40;
  color: #333;
  //   text-align: center;
  line-height: 60px;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    height: 100%;
    > img {
      height: 70%;
    }
    > span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #313743;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-submenu {
    text-align: left;
  }
  .el-menu {
    border: none;
  }
  .Fold {
    text-align: center;
    line-height: 26px;
    color: #fff;
    letter-spacing: 5px;
    cursor: pointer;
    margin: 10px 0;
  }
}

.el-main {
  background-color: rgba(233, 237, 241);
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}
// 进入的路由的初始状态类名
.fade-enter {
  visibility: hidden;
  opacity: 0;
  transform: translateX(100%);
}
// 离开的路由最后的状态类名
.fade-leave-to {
  visibility: hidden;
  opacity: 0;
  transform: translateX(-100%);
}
// 离开和进入的路由类名
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
// 进入路由停止最后一帧的类名，离开路由初始状态的类名
.fade-enter-to,
.fade-leave {
  visibility: visible;
  opacity: 1;
  transform: translateX(0);
}
</style>