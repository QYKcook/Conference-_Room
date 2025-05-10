<template>
  <div class="home-container">
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h1 class="welcome-title">会议室预约系统已上线</h1>
        <p class="welcome-subtitle">欢迎使用！</p>
        
        <div class="system-info">
          <p>高效 · 便捷 · 智能的会议室管理解决方案</p>
          <p>随时随地预约您需要的会议室资源</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 不需要导入图标了
</script>

<style scoped>
.home-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px); /* 减去header和padding的高度 */
}

.welcome-card {
  max-width: 800px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border: none;
}

.welcome-content {
  padding: 60px 40px;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.welcome-subtitle {
  font-size: 1.8rem;
  color: #42b983;
  margin-bottom: 30px;
  font-weight: 500;
}

.system-info {
  margin-top: 40px;
}

.system-info p {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  margin: 10px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1.5rem;
  }
  
  .system-info p {
    font-size: 1rem;
  }
}
</style>