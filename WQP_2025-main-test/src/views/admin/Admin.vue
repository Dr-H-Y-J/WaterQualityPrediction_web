<!-- src/views/admin/Admin.vue -->
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
// 添加必要的图标导入
import { 
  HomeFilled, 
  UserFilled, 
  User, 
  Edit, 
  Upload, 
  DataAnalysis, 
  TrendCharts, 
  Lightning 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 导航栏自动隐藏相关状态
const isNavbarVisible = ref(true)
const lastScrollTop = ref(0)
const navbarHeight = ref(64) // 与CSS中的高度一致

// 处理滚动事件
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  
  // 向下滚动时隐藏导航栏，向上滚动时显示导航栏
  if (scrollTop > lastScrollTop.value && scrollTop > navbarHeight.value) {
    isNavbarVisible.value = false
  } else {
    isNavbarVisible.value = true
  }
  
  lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop
}

// 挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 卸载前移除监听器
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 监听路由变化，确保导航栏状态正确
watch(
  () => route.path,
  (newPath) => {
    // 可以在这里添加路由变化时的处理逻辑
  },
  { immediate: true }
)
</script>

<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <el-header 
      class="top-navbar" 
      :class="{ 'navbar-hidden': !isNavbarVisible }"
    >
      <div class="navbar-content">
        <div class="logo-section">
          <img src="/src/assets/img/logo.png" alt="Logo" class="logo-image" />
          <h1 class="logo-title">水质预测平台</h1>
        </div>
        
        <el-menu
          mode="horizontal"
          router
          :default-active="route.path"
          class="navbar-menu"
        >
          <el-menu-item index="/admin/system/analysis">
            <el-icon><HomeFilled /></el-icon>
            <span>数据看板</span>
          </el-menu-item>

          <el-sub-menu index="/admin/user">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/system/role">
              <el-icon><User /></el-icon>
              <span>角色管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/user/update">
              <el-icon><Edit /></el-icon>
              <span>用户信息修改</span>
            </el-menu-item>
            <el-menu-item index="/admin/user/insert">
              <el-icon><Upload /></el-icon>
              <span>用户批量创建</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/admin/water-quality">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>水质预测</span>
            </template>
            <el-menu-item index="/admin/water-quality/prediction">
              <el-icon><TrendCharts /></el-icon>
              <span>水质预测</span>
            </el-menu-item>
            <el-menu-item index="/admin/water-quality/advice">
              <el-icon><Lightning /></el-icon>
              <span>优化建议</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-header>
    
      <!-- 背景装饰板 -->
  <div class="background-panel">
    <div class="background-animation"></div>
    <div class="drops-container">
      <div class="drop drop1"></div>
      <div class="drop drop2"></div>
    </div>
    <div class="background-overlay"></div>
    <div class="background-content">
      <h2 class="background-title">水质监测与预测系统</h2>
      <p class="background-subtitle">实时监控 · 智能预测 · 科学决策</p>
    </div>
  </div>
    
    <!-- 主内容区域 -->
    <div class="main-content" id="mainContent">
      <router-view 
        v-slot="{ Component, route }"
        :key="route.fullPath"
      >
        <transition name="slide-fade" mode="out-in" appear>
          <component 
            :is="Component" 
            :key="route.fullPath"
            class="router-view-component" 
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏样式 */
.top-navbar {
  height: 64px;
  padding: 0;
  background: linear-gradient(90deg, #002140, #001529);
  box-shadow: 0 4px 16px 0 rgba(0, 21, 41, 0.25);
  z-index: 100;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease-in-out;
}

/* 导航栏隐藏时的样式 */
.top-navbar.navbar-hidden {
  transform: translateY(-100%);
}

.navbar-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.logo-image {
  height: 36px;
  width: 36px;
  margin-right: 12px;
}

.logo-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* 背景装饰板样式 */
.background-panel {
  min-height: 50vh; /* 至少占半个屏幕高度 */
  height: 60vh; /* 默认高度为视窗高度的60% */
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* CSS动画背景 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #00c6fb, #005bea, #00c9ff, #92fe9d, #ff758c, #ff0000);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  z-index: 1;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 水滴容器 */
.drops-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* 水滴样式 - 进一步增大水滴尺寸 */
.drop {
  position: absolute;
  height: 220px;
  width: 220px;
  background: #54ABFB;
  border-radius: 51% 49% 48% 52% / 62% 44% 56% 38%;
  opacity: 0.8;
  border: 2px solid #3d93ff;
  animation: float 8s ease-in-out infinite;
}

.drop::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  background: #318CFE;
  border-radius: 51% 49% 48% 52% / 62% 44% 56% 38%;
  box-shadow: -20px 30px 16px #1B6CFB, -40px 60px 32px #1b6cfb, inset -6px 6px 10px #1B6CFB, inset 2px 6px 10px #1a74e5, inset 20px -20px 22px rgba(255, 255, 255, 0.7), inset 40px -40px 44px #a8ceff;
}

.drop::after {
  content: "";
  position: absolute;
  height: 44px;
  width: 44px;
  background: #E6FDFB;
  border-radius: 44% 56% 46% 54% / 36% 50% 50% 64%;
  left: 143px;
  top: 44px;
  box-shadow: 16px 40px 0 -10px rgba(255, 255, 255, 0.8);
  opacity: 0.8;
}

/* 调整水滴位置，增加高低差并保持中心对称 */
.drop1 {
  left: 5%;
  top: 10%;
  animation-delay: 0s;
}

.drop2 {
  right: 5%;
  top: 40%;
  z-index: -1;
  border-radius: 46% 50% 39% 54% / 56% 57% 50% 50%;
  animation-delay: -4s;
}

.drop2::before {
  border-radius: 46% 50% 39% 54% / 56% 57% 50% 50%;
}

/* 水滴浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 33, 64, 0.7), rgba(0, 21, 41, 0.8));
  z-index: 3;
}


.background-content {
  position: relative;
  z-index: 4;
  text-align: center;
  color: white;
  padding: 20px;
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.background-title {
  font-size: 3.5vw; /* 使用视窗宽度单位，实现响应式 */
  font-weight: 700; /* 加粗字体 */
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 1px; /* 增加字符间距 */
  font-family: 'Helvetica Neue', 'Arial', 'PingFang SC', 'Hiragino Sans GB', sans-serif; /* 现代字体族 */
  line-height: 1.2;
}

.background-subtitle {
  font-size: 1.8vw; /* 使用视窗宽度单位，实现响应式 */
  font-weight: 400;
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px; /* 增加字符间距 */
  font-family: 'Helvetica Neue', 'Arial', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  line-height: 1.5;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.main-content :deep(.router-view-component) {
  flex: 1;
  background: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
  padding: 20px;
  border: 1px solid #ebeef5;
  border-top: none;
}

/* 优化过渡动画 */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 导航菜单样式 */
.navbar-menu {
  flex: 1;
  border: none;
  background: transparent;
  height: 100%;
}

:deep(.navbar-menu .el-menu-item),
:deep(.navbar-menu .el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.75) !important;
  transition: all 0.3s;
  height: 64px;
  line-height: 64px;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin: 0 2px;
}

:deep(.navbar-menu .el-menu-item:hover),
:deep(.navbar-menu .el-sub-menu__title:hover) {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
}

:deep(.navbar-menu .el-menu-item.is-active) {
  color: #ffffff !important;
  background: linear-gradient(90deg, #1890ff, #40a9ff) !important;
  border-bottom: 2px solid #1890ff;
  border-radius: 4px 4px 0 0;
}

:deep(.navbar-menu .el-sub-menu.is-active .el-sub-menu__title) {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-radius: 4px 4px 0 0;
}

:deep(.navbar-menu .el-menu--horizontal .el-menu-item:not(.is-disabled):focus),
:deep(.navbar-menu .el-menu--horizontal .el-menu-item:not(.is-disabled):hover),
:deep(.navbar-menu .el-menu--horizontal .el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

:deep(.navbar-menu .el-menu--popup) {
  background: #001529;
  border-radius: 6px;
  padding: 8px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 6px 20px 0 rgba(0, 21, 41, 0.3);
}

:deep(.navbar-menu .el-menu--popup .el-menu-item) {
  height: 40px;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.75) !important;
  min-width: 160px;
  padding: 0 20px !important;
}

:deep(.navbar-menu .el-menu--popup .el-menu-item:hover) {
  color: #ffffff !important;
  background-color: rgba(24, 144, 255, 0.2) !important;
}

:deep(.navbar-menu .el-menu--popup .el-menu-item.is-active) {
  color: #ffffff !important;
  background: linear-gradient(90deg, #1890ff, #40a9ff) !important;
}

/* 图标样式 */
:deep(.navbar-menu .el-menu-item .el-icon),
:deep(.navbar-menu .el-sub-menu__title .el-icon) {
  margin-right: 8px;
  width: 20px;
  text-align: center;
  font-size: 16px;
  vertical-align: middle;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    height: auto;
    padding: 10px 0;
  }
  
  .logo-section {
    margin-right: 0;
    margin-bottom: 10px;
    justify-content: center;
  }
  
  .navbar-menu {
    height: auto;
  }
  
  :deep(.navbar-menu .el-menu-item),
  :deep(.navbar-menu .el-sub-menu__title) {
    color: rgba(255, 255, 255, 0.75) !important;
    transition: all 0.3s;
    height: 48px;
    line-height: 48px;
    padding: 0 12px;
    border-radius: 4px;
    margin: 2px 4px;
  }
  
  .background-panel {
    min-height: 50vh;
    height: 65vh; /* 移动端增加高度以显示更多信息 */
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .background-title {
    font-size: 24px;
  }
  
  .background-subtitle {
    font-size: 16px;
  }
  
   
  .drop1 {
    left: 5%;
    top: 10%;
    height: 150px;
    width: 150px;
  }
  
  .drop2 {
    right: 5%;
    top: 35%;
    height: 150px;
    width: 150px;
  }
  
  .drop::after {
    height: 30px;
    width: 30px;
    left: 97px;
    top: 30px;
  }
}
</style>