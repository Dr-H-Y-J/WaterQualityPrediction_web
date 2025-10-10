<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const router = useRouter()
const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 监听路由变化，确保侧边栏状态正确
watch(
  () => router.currentRoute.value.path,
  () => {
    // 路由变化时的处理逻辑
  }
)
</script>

<template>
  <div class="admin-container">
    <!-- 侧边栏 -->
    <el-aside 
      class="sidebar" 
      :class="{ 'is-collapsed': isCollapse }"
    >
      <div class="sidebar-content">
        <!-- Logo区域 -->
        <div class="logo-container">
          <img src="/src/assets/img/logo.png" alt="Logo" class="logo-image" />
          <transition name="fade" mode="out-in">
            <h1 v-show="!isCollapse" key="title" class="logo-title">水质预测</h1>
          </transition>
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>

        <!-- 导航菜单 -->
        <el-menu
          router
          unique-opened
          :collapse="isCollapse"
          :default-active="router.currentRoute.value.path"
          class="sidebar-menu"
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
    </el-aside>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" class="router-view-component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 220px; /* 明确指定宽度 */
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 12px 0 rgba(0, 21, 41, 0.08);
  z-index: 100;
  background: linear-gradient(180deg, #001529, #001529 50%, #002140);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar.is-collapsed {
  width: 64px; /* 明确指定折叠宽度 */
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Logo区域样式 */
.logo-container {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  color: white;
  background: linear-gradient(90deg, #002140, #001529);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  min-height: 64px;
}

.logo-image {
  height: 36px;
  width: 36px;
  margin-right: 12px;
  transition: all 0.3s;
}

.logo-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s;
}

.collapse-btn {
  cursor: pointer;
  transition: all 0.3s;
  color: #ffffff;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  width: 36px;
  height: 36px;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

/* 展开状态下的样式 */
.sidebar:not(.is-collapsed) .logo-container {
  justify-content: flex-start;
}

.sidebar:not(.is-collapsed) .logo-title {
  display: block;
  margin-right: auto;
}

.sidebar:not(.is-collapsed) .collapse-btn {
  margin-left: auto;
  transform: rotate(0deg);
}

/* 收起状态下的样式 */
.sidebar.is-collapsed .logo-container {
  justify-content: center;
  padding: 20px 8px;
}

.sidebar.is-collapsed .logo-image {
  display: none;
}

.sidebar.is-collapsed .logo-title {
  display: none;
}

.sidebar.is-collapsed .collapse-btn {
  margin: 0;
  transform: rotate(180deg);
}

/* 菜单区域样式 */
.sidebar-menu {
  flex: 1;
  border: none;
  background: transparent;
  overflow-y: auto;
  padding: 16px 0;
}

/* 菜单项样式优化 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #b0b0b0;
  transition: all 0.3s;
  height: 48px;
  line-height: 48px;
  margin: 0 8px;
  border-radius: 6px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  color: #ffffff;
  background-color: rgba(24, 144, 255, 0.15) !important;
}

/* 统一激活状态样式 */
:deep(.el-menu-item.is-active) {
  color: #ffffff !important;
  background: linear-gradient(90deg, #1890ff, #40a9ff) !important;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #ffffff !important;
  background-color: rgba(24, 144, 255, 0.15) !important;
}

:deep(.el-menu--inline .el-menu-item) {
  background: transparent !important;
  margin: 0 8px 0 24px;
  height: 40px;
  line-height: 40px;
}

:deep(.el-menu--inline .el-menu-item:hover) {
  background-color: rgba(24, 144, 255, 0.1) !important;
}

:deep(.el-menu--inline .el-menu-item.is-active) {
  background: linear-gradient(90deg, #1890ff, #40a9ff) !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

/* 图标样式 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  font-size: 16px;
  vertical-align: middle;
}

/* 折叠动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background-color: transparent;
}

.router-view-component {
  height: 100%;
  min-height: 100%;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background-color: #f5f7fa;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.main-content :deep(.router-view-component) {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: auto;
}

.main-content :deep(.el-scrollbar) {
  height: 100%;
}

/* 内容区域过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
/* 添加水波纹效果 */
.sidebar {
  background: linear-gradient(180deg, #001529, #001529 50%, #002140);
  position: relative;
  overflow: hidden;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
  animation: wave 15s infinite linear;
  z-index: 0;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


/* Logo区域添加水波动画 */
.logo-container {
  background: linear-gradient(90deg, #002140, #001529);
  position: relative;
  overflow: hidden;
}

.logo-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1890ff, transparent);
  animation: flow 3s infinite;
}

@keyframes flow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
  }
  
  .main-content {
    margin-left: 0;
  }
}
</style>