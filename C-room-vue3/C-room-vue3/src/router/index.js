import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Layout from '@/components/Layout.vue'
import HomeView from '@/views/HomeView.vue'

// 页面组件
const Home = { template: '<div>欢迎来到会议室预约系统</div>' }
const Reservation = { template: '<div>会议室预约页面</div>' }
const Records = { template: '<div>我的预约记录</div>' }
const Profile = { template: '<div>个人信息管理</div>' }

const routes = [
  {
    path: '/',
    redirect: '/login' // 默认重定向到登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登录', isPublic: true }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: HomeView,
        meta: { title: '首页' }
      },
      {
        path: 'reservation',
        name: 'Reservation',
        component: Reservation,
        meta: { title: '会议室预约' }
      },
      {
        path: 'records',
        name: 'Records',
        component: Records,
        meta: { title: '预约记录' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { title: '个人信息' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userData = localStorage.getItem('user')
  let user = null
  
  try {
    user = userData ? JSON.parse(userData) : null
  } catch (e) {
    console.error('解析用户数据失败:', e)
    localStorage.removeItem('user')
  }

  // 检查账号状态
  if (user?.status === 'UNACTIVATED') {
    localStorage.removeItem('user')
    next('/login?error=unactivated')
    return
  }

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 会议室预约系统` : '会议室预约系统'
  
  // 如果是公开路由直接放行
  if (to.meta.isPublic) {
    next()
    return
  }
  
  // 如果访问需要认证的路由且未登录，重定向到登录页
  if (to.meta.requiresAuth && !user) {
    next('/login')
    return
  }
  
  // 如果已登录但访问登录页，重定向到首页
  if (to.path === '/login' && user) {
    next('/home')
    return
  }
  
  next()
})

export default router