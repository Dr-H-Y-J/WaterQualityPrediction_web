<!-- src/views/admin/UserUpdate.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

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

// 截取UUID显示
const formatUUID = (uuid) => {
  if (!uuid) return ''
  // 显示前8位和后4位，中间用省略号
  return `${uuid.substring(0, 2)}...${uuid.substring(uuid.length - 2)}`
}

// 获取用户数据
const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/user/getuser', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
      },
    })
    const result = response.data
    userList.value = result.users
    total.value = result.total

    // 保持页码不超过最大页数
    if (currentPage.value > result.pages && result.pages > 0) {
      currentPage.value = result.pages
      await fetchUsers()
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    ElMessage.error('获取用户数据失败')
  }
}

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
    // 使用axios发送表单数据
    const response = await axios.post('/api/user/update', null, {
      params: {
        id: row.id,
        username: row.username,
        password: row.password,
      },
    })

    if (response.status === 200) {
      ElMessage.success('修改成功')
      editableIds.value = editableIds.value.filter((id) => id !== row.id)
      originalDataCache.delete(row.id)
    }
  } catch (err) {
    console.error('保存失败:', err)
    const errorMsg = err.response?.data || err.message || '未知错误'
    ElMessage.error(`保存失败: ${errorMsg}`)
    cancelEdit(row)
  }
}

// 初始化时获取数据
onMounted(() => {
  fetchUsers()
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
                <span class="uuid-display">{{ formatUUID(row.id) }}</span>
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

          <!-- 密码列（可编辑） -->
          <el-table-column prop="password" label="密码">
            <template #default="{ row }">
              <el-input
                v-if="editableIds.includes(row.id)"
                v-model="row.password"
                type="password"
                show-password
              />
              <span v-else>{{ row.password.replace(/./g, '*') }}</span>
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

<!-- 在 UserUpdate.vue 中替换整个 <style scoped> 部分 -->
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