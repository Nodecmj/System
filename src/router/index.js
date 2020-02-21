import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  // 重定向，如果访问的路径是/，那就跳转到login
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import(/* webpackChunkName: "about" */ '../components/Home.vue'),
    children: [{
      path: '/welcome',
      name: '/welcome',
      component: () => import('../components/Welcome.vue')
    }, {
      path: '/users',
      name: '/users',
      component: () => import('../components/user/Users.vue')
    }, {
      path: '/rights',
      name: '/rights',
      component: () => import('../components/power/Rights.vue')
    }, {
      path: '/roles',
      name: '/roles',
      component: () => import('../components/power/Roles.vue')
    }, {
      path: '/categories',
      name: '/cate',
      component: () => import('../components/goods/Cate.vue')
    }, {
      path: '/params',
      name: '/params',
      component: () => import('../components/goods/Params.vue')
    }, {
      path: '/goods',
      name: '/goods',
      component: () => import('../components/goods/Goods.vue')
    }, {
      path: '/goods/add',
      name: '/add',
      component: () => import('../components/goods/Add.vue')
    }, {
      path: '/orders',
      name: '/orders',
      component: () => import('../components/Orders/Orders.vue')
    }, {
      path: '/reports',
      name: '/reports',
      component: () => import('../components/reports/Reports.vue')
    }]
  },
]


const router = new VueRouter({
  routes
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  //to 将要访问的路径
  //from 从哪个路径跳转而来
  //next 是一个函数，表示放行  next()放行  next(/login)强制跳转对应路由
  // 判断前往的是否是登录页 并且是否有token 如果没有token并且前往的是登录页面那么就可以前往登录页
  if (to.path === '/login' && !tokenStr) {
    return next();
  } else if (to.path === '/login' && tokenStr) {
    // 如果有token并且访问的是登录页面 那么就没必要在重登一次 就定位到home首页
    return next('/welcome')
  } else if (!tokenStr) {
    // 如果没有token 那么就访问登录页面
    return next('/login');
  }
  // 有token，那就可以 访问其他页面
  next();
})

export default router
