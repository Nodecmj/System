import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/index.css'

// 引入附文本组件
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 nprogress 包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// interceptors是一个预处理请求的过程 给请求头对象挂载一个自定义属性 因为某些接口需要在请求头赋token才能获取 所以用这个请求拦截器 每次请求前 给请求头挂载Authorization = token
// 请求拦截，给每个请求加一个字段
axios.interceptors.request.use(config => {
  // 在request拦截器 也就是请求过程中，展示进度条 NProgress.start()
  NProgress.start()
  // config就是请求对象
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 最后必须return config
  return config
})

//在 response 拦截器中 也就是数据请求完成 响应了，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})



// 挂载附文本文件给全局使用
Vue.use(VueQuillEditor)

Vue.prototype.$http = axios;

Vue.config.productionTip = false

// 定义一个格式化时间的过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
