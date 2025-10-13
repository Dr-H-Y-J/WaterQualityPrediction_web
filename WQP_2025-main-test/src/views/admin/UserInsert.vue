<!-- src/views/admin/UserInsert.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { read, utils, writeFileXLSX } from 'xlsx'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
// 添加图标导入
import { Upload, Check } from '@element-plus/icons-vue'

const importLoading = ref(false)
const previewData = ref([])
const excelHeaders = ref([])
const rowErrors = ref({})
const originalFile = ref(null)
const router = useRouter()
const route = useRoute()

// 只保留账号和密码
const SAMPLE_HEADERS = ['账号', '密码']

// 校验规则只保留账号和密码
const validationRules = {
  账号: (v) => !!v?.trim() || '账号不能为空',
  密码: (v) => !!v?.trim() || '密码不能为空',
}

const hasValidationErrors = computed(() => Object.keys(rowErrors.value).length > 0)
const validationErrors = computed(() => Object.values(rowErrors.value).flat())

// 重置组件状态
const resetComponentState = () => {
  previewData.value = []
  excelHeaders.value = []
  rowErrors.value = {}
  originalFile.value = null
  importLoading.value = false
}

// 监听路由更新，在同级路由切换时重置组件状态
onBeforeRouteUpdate((to, from) => {
  if (to.path.includes('user') && from.path.includes('user')) {
    resetComponentState()
  }
})

// 离开路由前的确认
onBeforeRouteLeave((to, from) => {
  if (previewData.value.length > 0) {
    const answer = window.confirm('您有未保存的数据，确定要离开吗？')
    if (!answer) return false
  }
})

const handleFileChange = async (uploadFile) => {
  const loading = ElLoading.service({ lock: true })
  try {
    originalFile.value = uploadFile.raw
    const data = await uploadFile.raw.arrayBuffer()
    const workbook = read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      defval: '',
    })

    if (!arraysEqual(jsonData[0], SAMPLE_HEADERS)) {
      ElMessage.error('文件列头与模板不一致')
      previewData.value = []
      return
    }

    excelHeaders.value = jsonData[0]
    previewData.value = jsonData.slice(1).map((row, index) => {
      const item = excelHeaders.value.reduce((obj, header, i) => {
        obj[header] = (row[i] ?? '').toString().trim()
        return obj
      }, {})
      validateRow(item, index)
      return item
    })
  } catch (error) {
    ElMessage.error(`文件解析失败: ${error.message}`)
  } finally {
    loading.close()
  }
}

const handleImport = async () => {
  importLoading.value = true
  try {
    if (!originalFile.value) {
      ElMessage.error('请先选择文件')
      return
    }

    if (hasValidationErrors.value) {
      ElMessage.error('请先修正数据错误')
      return
    }

    // 批量创建用户
    const usersToCreate = previewData.value.map(item => ({
      username: item.账号,
      password: item.密码,
      // 可以添加默认角色等其他字段
      role: 'user' // 默认角色
    }))

    // 修复API路径 - 使用正确的批量创建用户接口
    const response = await axios.post('/api/users/batch-create', usersToCreate)
    
    if (response.data.success) {
      const { createdCount, failedCount } = response.data.data
      ElMessage.success(`导入完成：成功创建 ${createdCount} 条数据，失败 ${failedCount} 条`)
      
      // 导入成功后询问用户是否跳转到用户管理页面
      ElMessageBox.confirm(
        '用户导入成功，是否跳转到用户管理页面查看？',
        '导入完成',
        {
          confirmButtonText: '跳转查看',
          cancelButtonText: '继续导入',
          type: 'success',
        }
      ).then(() => {
        router.push('/admin/user/update')
      }).catch(() => {
        // 用户选择继续导入，重置表单
        resetComponentState()
      })
    } else {
      throw new Error(response.data.message || '导入失败')
    }
  } catch (error) {
    console.error('导入失败详情:', error)
    const msg = error.response?.data?.message || error.message || '导入失败'
    ElMessage.error(`导入失败: ${msg}`)
  } finally {
    importLoading.value = false
  }
}

// 下载模板只包含账号和密码
const downloadTemplate = () => {
  const workbook = utils.book_new()
  const worksheet = utils.aoa_to_sheet([SAMPLE_HEADERS])
  utils.book_append_sheet(workbook, worksheet, '用户数据')
  writeFileXLSX(workbook, '用户批量导入模板.xlsx')
}

const arraysEqual = (a, b) => {
  if (a?.length !== b?.length) return false
  return a.every((val, index) => val === b[index])
}

const validateRow = (row, rowIndex) => {
  const errors = []
  excelHeaders.value.forEach((header) => {
    const validator = validationRules[header]
    if (validator) {
      const result = validator(row[header])
      if (result !== true) errors.push(result)
    }
  })

  if (errors.length) {
    rowErrors.value[rowIndex] = errors
  } else {
    delete rowErrors.value[rowIndex]
  }
}

// 组件挂载时重置状态
onMounted(() => {
  resetComponentState()
})

// 组件卸载前清理
onUnmounted(() => {
  resetComponentState()
})

// 添加跳转到用户管理的方法
const goToUserManagement = () => {
  router.push('/admin/user/update')
}
</script>

<template>
   <div class="excel-import-export">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-left">
        <h2>用户批量导入</h2>
        <p class="subtitle">通过Excel文件批量导入用户信息</p>
      </div>
      <div class="header-right">
        <el-button @click="goToUserManagement" type="primary" plain>
          用户管理
        </el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <el-card shadow="hover" class="flex-card">
        <template #header>
          <div class="card-header">
            <span>用户批量导入 (账号/密码)</span>
            <el-button type="primary" link @click="downloadTemplate"> 下载模板 </el-button>
          </div>
        </template>

        <div class="upload-section">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept=".xlsx, .xls"
            class="upload-demo"
          >
            <template #trigger>
              <el-button type="primary" :loading="importLoading" size="large" class="upload-button">
                <el-icon><Upload /></el-icon>
                选择 Excel 文件
              </el-button>
            </template>
          </el-upload>
          
          <el-button
            type="success"
            :disabled="!previewData.length || hasValidationErrors"
            @click="handleImport"
            :loading="importLoading"
            size="large"
            class="import-button"
          >
            <el-icon><Check /></el-icon>
            确认导入
          </el-button>
        </div>

        <div v-if="previewData.length" class="mt-4">
          <el-alert v-if="hasValidationErrors" type="error" show-icon class="mb-2">
            存在 {{ validationErrors.length }} 条数据校验错误，请修正后再提交！
          </el-alert>

          <el-table :data="previewData" border height="100%" style="width: 100%;">
            <el-table-column
              v-for="(header, index) in excelHeaders"
              :key="index"
              :prop="header"
              :label="header"
            >
              <template #default="{ row, $index }">
                <el-input
                  v-model="row[header]"
                  @change="validateRow(row, $index)"
                  :class="{ 'error-cell': rowErrors[$index]?.includes(header) }"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.excel-import-export {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #f5f7fa;
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

.header-right {
  display: flex;
  align-items: center;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-cell :deep(.el-input__inner) {
  border-color: #ff4d4f;
  background-color: #fff2f0;
}

.error-messages {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.flex-card {
  flex: 1;
  display: flex !important;
  flex-direction: column;
  min-height: 0;
}

:deep(.flex-card .el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

:deep(.el-table) {
  flex: 1;
  margin-bottom: 16px;
  min-height: 300px;
}

.upload-section {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .upload-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-right {
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style>