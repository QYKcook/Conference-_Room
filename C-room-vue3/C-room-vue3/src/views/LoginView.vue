<template>
  <div class="login-container">
    <div class="login-box">
      <el-tabs v-model="activeTab" stretch class="auth-tabs">
        <el-tab-pane label="登录" name="login">
          <h2>会议室预约系统登录</h2>
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                <template #prefix>
                  <el-icon><user /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              >
                <template #prefix>
                  <el-icon><lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                @click="handleLogin"
                :loading="loading"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <h2>新用户注册</h2>
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" clearable>
                <template #prefix>
                  <el-icon><avatar /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              >
                <template #prefix>
                  <el-icon><lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="fullName">
              <el-input v-model="registerForm.fullName" placeholder="请输入真实姓名" clearable>
                <template #prefix>
                  <el-icon><edit /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="registerForm.phone" placeholder="请输入手机号" clearable>
                <template #prefix>
                  <el-icon><iphone /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="company">
              <el-input v-model="registerForm.company" placeholder="请输入公司/单位" clearable>
                <template #prefix>
                  <el-icon><office-building /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="role">
              <el-select
                v-model="registerForm.role"
                placeholder="请选择身份"
                style="width: 100%"
              >
                <el-option label="管理员" value="ADMIN" />
                <el-option label="员工" value="STAFF" />
                <el-option label="客户" value="CLIENT" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                @click="handleRegister"
                :loading="registerLoading"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock,Avatar, Edit, Iphone, OfficeBuilding  } from '@element-plus/icons-vue';
import axios from 'axios';
import request from '@/api/request'

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);
const registerLoading = ref(false);
const registerFormRef = ref(null);
const activeTab = ref('login'); // 添加activeTab定义


const loginForm = ref({
  usernane: '',
  password: ''
});

// 注册表单数据
const registerForm = ref({
  id: '',
  username: '',
  password: '',
  fullName: '',
  phone: '',
  company: '',
  role: '',
  status: 'UNACTIVATED'
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};


// 注册验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
  ],
  fullName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    
  ],
  company: [
    { required: true, message: '请输入公司/单位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择身份', trigger: 'change' }
  ]
};

// 登录方法
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loading.value = true;
    
    // 登录接口
    const response = await axios.post('/api/auth/login', 
      `username=${encodeURIComponent(loginForm.value.username)}&password=${encodeURIComponent(loginForm.value.password)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const user = response.data;
    
    // 检查账号状态
    if (user.status === 'UNACTIVATED') {
      throw new Error('账号未激活，请联系管理员');
    }

    // 存储用户信息（去除敏感字段）
    const { password, ...safeUser } = user;
    localStorage.setItem('user', JSON.stringify(safeUser));
    
    router.push('/home');
    ElMessage.success(`欢迎回来，${user.fullName || user.username}`);
  } catch (error) {
    let message = '登录失败';
    if (error.response) {
      if (error.response.status === 401) {
        message = '用户名或密码错误';
      } else if (error.response.status === 404) {
        message = '用户不存在';
      } else {
        message = error.response.data?.message || `服务器错误: ${error.response.status}`;
      }
    } else {
      message = error.message;
    }
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    registerLoading.value = true
    
    // 获取当前ISO格式时间
    const now = new Date().toISOString()
    
    // 准备请求数据
    const payload = {
      username: registerForm.value.username.toString(),
      password: registerForm.value.password.toString(),
      fullName: registerForm.value.fullName,
      phone: registerForm.value.phone,
      company: registerForm.value.company,
      role: registerForm.value.role,
      status: "UNACTIVATED", // 固定状态
      createdAt: now, // 当前时间
      updatedAt: now  // 当前时间
    }

    // 打印调试信息
    console.log('发送的数据:', JSON.stringify(payload, null, 2))

    // 发送POST请求
    const response = await axios.post(
      '/api/users',  // 修改为/users接口
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [
        (data) => JSON.stringify(data) // 确保序列化
      ]
      }
    )

    ElMessage.success('注册成功，请等待管理员激活')
    activeTab.value = 'login' // 切换回登录标签页
    registerFormRef.value.resetFields() // 清空表单
  } catch (error) {
    let message = '注册失败'
    if (error.response) {
      if (error.response.status === 400) {
        message = '请求参数错误'
      } else if (error.response.status === 409) {
        message = '该用户ID已存在'
      } else if (error.response.status === 500) {
        message = '用户名已存在'
      }  else {
        message = error.response.data?.message || `服务器错误: ${error.response.status}`
      }
    } else {
      message = error.message || '网络错误'
    }
    ElMessage.error(message)
  } finally {
    registerLoading.value = false
  }
}

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-box {
  width: 450px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.el-form-item {
  margin-bottom: 22px;
}
</style>