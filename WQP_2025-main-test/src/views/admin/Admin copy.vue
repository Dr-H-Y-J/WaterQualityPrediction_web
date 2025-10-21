<!-- src/views/admin/Admin.vue -->
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
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
    <el-header class="top-navbar">
      <div class="navbar-content">
        <div class="logo-section">
          <img src="/src/assets/img/logo.png" alt="Logo" class="logo-image" />
          <h1 class="logo-title">水质预测</h1>
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
    
    <!-- 主内容区域 -->
    <div class="main-content">
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
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
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

/* 主内容区域样式 */
.main-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.main-content :deep(.router-view-component) {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
  padding: 20px;
  overflow: auto;
  border: 1px solid #ebeef5;
}

.main-content :deep(.el-scrollbar) {
  height: 100%;
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
}
</style>