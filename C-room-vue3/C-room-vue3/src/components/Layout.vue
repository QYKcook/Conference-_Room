<template>
  <div class="layout-container">
    <!-- 顶部Header -->
    <header class="header">
      <div class="header-left">
        <h1>{{ title }}</h1>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ user.fullName || user.username }}
              <span class="user-role">({{ getRoleName(user.role) }})</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleProfile">个人信息</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <div class="main-container">
      <!-- 左侧Aside -->
      <aside class="aside">
        <nav class="menu">
          <ul>
            <li v-for="item in menuItems" :key="item.path">
              <router-link :to="item.path">
                <span class="icon" v-if="item.icon">
                  <el-icon><component :is="item.icon" /></el-icon>
                </span>
                <span class="text">{{ item.title }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  House,
  Calendar,
  Tickets,
  User as UserIcon,
  ArrowDown
} from '@element-plus/icons-vue';

const router = useRouter();
const title = ref('会议室预约系统');
const user = ref({});

// 角色映射函数
const getRoleName = (role) => {
  const roleMap = {
    'ADMIN': '管理员',
    'STAFF': '员工',
    'CLIENT': '客户'
  };
  return roleMap[role] || role; // 如果没有匹配的，返回原始角色
};


// 根据用户角色动态生成菜单
const menuItems = ref([
  { path: '/home', title: '首页', icon: House },
  { path: '/reservation', title: '会议室预约', icon: Calendar },
  { path: '/records', title: '预约记录', icon: Tickets },
  { path: '/profile', title: '个人信息', icon: UserIcon },
]);

// 初始化用户信息
onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

const handleProfile = () => {
  router.push('/profile');
};

const handleLogout = () => {
  localStorage.removeItem('user');
  router.push('/login');
  ElMessage.success('已退出登录');
};
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right nav {
  display: flex;
  gap: 15px;
}

.header-right a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.header-right a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-right a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.aside {
  width: 220px;
  background-color: #34495e;
  color: white;
  overflow-y: auto;
  transition: width 0.3s;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu li a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.icon {
  margin-right: 10px;
}

.main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>