<!-- src/views/admin/UserUpdate.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

// 用户列表数据
const userList = ref([])
// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
// 正在编辑的用户ID列表
const editableIds = ref([])
// 缓存原始数据
const originalDataCache = new Map()

// 截取ID显示
const formatId = (id) => {
  // 转换为字符串并检查有效性
  const str = id != null ? String(id) : ''
  
  if (!str) return ''
  
  // 对于较短的ID，直接显示
  if (str.length <= 6) return str
  
  // 对于较长的ID，显示前2位和后2位
  return `${str.substring(0, 2)}...${str.substring(str.length - 2)}`
}
// 获取用户数据
const fetchUsers = async () => {
  try {
    console.log('开始获取用户数据...', {
      page: currentPage.value,
      limit: pageSize.value
    });
    
    const response = await axios.get('/api/users', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
      },
    });
    
    console.log('API响应:', response.data);
    
    if (response.data.success) {
      userList.value = response.data.data;
      total.value = response.data.pagination?.total || response.data.data.length;
      console.log('成功获取用户数据，总数:', total.value);
    } else {
      throw new Error(response.data.message || '获取用户数据失败');
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    ElMessage.error('获取用户数据失败: ' + (error.response?.data?.message || error.message));
  }
};
// 分页变化处理
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  fetchUsers()
}

// 每页数量变化处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 切换分页大小时重置到第一页
  fetchUsers()
}

// 开始编辑
const startEdit = (row) => {
  originalDataCache.set(row.id, { ...row })
  editableIds.value.push(row.id)
}

// 取消编辑
const cancelEdit = (row) => {
  const originalData = originalDataCache.get(row.id)
  Object.assign(row, originalData)
  editableIds.value = editableIds.value.filter((id) => id !== row.id)
  originalDataCache.delete(row.id)
}

// 保存修改
const handleSave = async (row) => {
  try {
    // 准备更新数据
    const updateData = {
      username: row.username,
      email: row.email,
      role: row.role
    };

    // 只有当密码不为空时才更新密码
    if (row.password && row.password.trim() !== '') {
      updateData.password = row.password;
    }

    const response = await axios.put(`/api/users/${row.id}`, updateData);

    if (response.data.success) {
      ElMessage.success('修改成功');
      editableIds.value = editableIds.value.filter((id) => id !== row.id);
      originalDataCache.delete(row.id);
      // 清空密码输入框
      row.password = '';
    } else {
      throw new Error(response.data.message || '修改失败');
    }
  } catch (err) {
    console.error('保存失败:', err);
    const errorMsg = err.response?.data?.message || err.message || '未知错误';
    ElMessage.error(`保存失败: ${errorMsg}`);
    cancelEdit(row);
  }
};
// 初始化时获取数据
onMounted(() => {
  fetchUsers()
})

// 组件卸载前清理
onUnmounted(() => {
  editableIds.value = []
  originalDataCache.clear()
})

// 监听路由更新
onBeforeRouteUpdate((to, from) => {
  // 清理编辑状态
  editableIds.value = []
  originalDataCache.clear()
})

// 离开路由前确认
onBeforeRouteLeave((to, from) => {
  if (editableIds.value.length > 0) {
    const answer = window.confirm('您有未保存的编辑，确定要离开吗？')
    if (!answer) return false
  }
})
</script>

<template>
  <div class="page-container">
  <div class="content-wrapper">
  <div class="user-management">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-left">
        <h2>用户信息管理</h2>
        <p class="subtitle">管理系统中的用户信息</p>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="table-container">
        <el-table :data="userList" border style="width: 100%" height="75vh" class="el-table">
        <!-- 用户ID列 -->
        <el-table-column prop="id" label="用户ID" width="120">
          <template #default="{ row }">
            <el-tooltip effect="dark" :content="row.id" placement="top">
              <span class="uuid-display">{{ formatId(row.id) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

          <!-- 用户名列（可编辑） -->
          <el-table-column prop="username" label="用户名">
            <template #default="{ row }">
              <el-input v-if="editableIds.includes(row.id)" v-model="row.username" />
              <span v-else>{{ row.username }}</span>
            </template>
          </el-table-column>
          <!-- 密码列（改进版） -->
          <el-table-column prop="password" label="密码">
            <template #default="{ row }">
              <el-input
                v-if="editableIds.includes(row.id)"
                v-model="row.password"
                type="password"
                show-password
                placeholder="留空则不修改密码"
              />
              <span v-else>••••••</span>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <div v-if="editableIds.includes(row.id)">
                <el-button type="success" size="small" @click="handleSave(row)"> 保存 </el-button>
                <el-button size="small" @click="cancelEdit(row)"> 取消 </el-button>
              </div>
              <div v-else>
                <el-button type="primary" size="small" @click="startEdit(row)"> 编辑 </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.user-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-left h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.subtitle {
  margin: 5px 0 0 0;
  color: #909399;
  font-size: 14px;
}

/* 内容区域 */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: hidden;
  min-height: 500px;
  min-width: 1200px;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 表格样式 */
:deep(.el-table) {
  flex: 1;
  margin-bottom: 16px;
}

/* 分页容器 */
.pagination-container {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0 0;
  background: white;
}

.uuid-display {
  font-family: 'Courier New', monospace;
  color: #606266;
  cursor: pointer;
}

.uuid-display:hover {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    padding: 15px;
  }
  
  .content-section {
    padding: 15px;
  }
  
  .pagination-container {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>