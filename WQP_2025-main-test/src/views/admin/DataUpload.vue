<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { userStore } from '@/stores/user'

const store = userStore()

// 状态管理
const uploadLoading = ref(false)
const selectedFiles = ref([])
const validationResults = ref({})

// CSV文件要求的格式
// 更新数据字段定义
const requiredColumns = [
  { name: 'date', label: '日期时间', type: 'string' },
  { name: 'temperature', label: '温度(℃)', type: 'number' },
  { name: 'pH', label: '酸碱度', type: 'number' },
  { name: 'O2', label: '溶解氧(mg/L)', type: 'number' },
  { name: 'NTU', label: '浊度(NTU)', type: 'number' },
  { name: 'uS', label: '电导率(μS/cm)', type: 'number' }
]

// 更新示例数据
const exampleData = [
  { date: '2025-04-01 00', temperature: '18.2', pH: '7.2', O2: '5.2', NTU: '15.3', uS: '1850' },
  { date: '2025-04-01 01', temperature: '18.4', pH: '7.1', O2: '5.1', NTU: '16.2', uS: '1875' },
  // ... 更多示例数据
]

// 文件大小格式化
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 验证CSV文件格式
const validateCSVFormat = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          resolve({
            valid: false,
            error: '文件内容不足，至少需要标题行和一行数据'
          })
          return
        }

        // 检查标题行
        const header = lines[0].trim()
        const expectedHeader = requiredColumns.map(col => col.name).join(',')
        
        if (header !== expectedHeader) {
          resolve({
            valid: false,
            error: `标题行格式错误。期望: ${expectedHeader}，实际: ${header}`
          })
          return
        }

        // 检查数据行格式（只检查前几行）
        const sampleSize = Math.min(5, lines.length - 1)
        for (let i = 1; i <= sampleSize; i++) {
          const dataLine = lines[i].trim()
          const columns = dataLine.split(',')
          
          if (columns.length !== requiredColumns.length) {
            resolve({
              valid: false,
              error: `第${i+1}行列数不正确，期望${requiredColumns.length}列，实际${columns.length}列`
            })
            return
          }

          // 简单的数据类型检查
          for (let j = 0; j < columns.length; j++) {
            const value = columns[j].trim()
            const expectedType = requiredColumns[j].type
            
            if (expectedType === 'number' && value !== '' && isNaN(Number(value))) {
              resolve({
                valid: false,
                error: `第${i+1}行第${j+1}列(${requiredColumns[j].label})数据格式错误，期望数字类型`
              })
              return
            }
          }
        }

        resolve({
          valid: true,
          rows: lines.length - 1,
          preview: lines.slice(0, Math.min(6, lines.length)) // 包含标题行
        })
      } catch (error) {
        resolve({
          valid: false,
          error: '文件解析失败，请确保文件编码为UTF-8'
        })
      }
    }
    
    reader.onerror = () => {
      resolve({
        valid: false,
        error: '文件读取失败'
      })
    }
    
    reader.readAsText(file, 'UTF-8')
  })
}

// 文件选择处理
const handleFileChange = async (uploadFile) => {
  const file = uploadFile.raw
  
  // 检查文件格式
  if (!file.name.toLowerCase().endsWith('.csv')) {
    ElMessage.error('只支持CSV格式文件')
    return
  }

  // 检查文件大小（100MB限制）
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过100MB')
    return
  }

  // 检查文件是否已存在
  if (selectedFiles.value.find(f => f.name === file.name)) {
    ElMessage.warning('该文件已选择')
    return
  }

  const fileItem = {
    id: Date.now() + Math.random(),
    file: file,
    name: file.name,
    displayName: file.name.replace('.csv', ''),
    size: file.size,
    status: 'validating',
    isRenaming: false
  }

  selectedFiles.value.push(fileItem)

  // 异步验证文件格式
  try {
    const validation = await validateCSVFormat(file)
    validationResults.value[fileItem.id] = validation
    fileItem.status = validation.valid ? 'valid' : 'invalid'
    
    if (validation.valid) {
      ElMessage.success(`${file.name} 格式验证通过`)
    } else {
      ElMessage.error(`${file.name} 格式验证失败: ${validation.error}`)
    }
  } catch (error) {
    fileItem.status = 'invalid'
    validationResults.value[fileItem.id] = {
      valid: false,
      error: '文件验证过程中发生错误'
    }
    ElMessage.error(`${file.name} 验证失败`)
  }
}

// 删除文件
const removeFile = (fileId) => {
  selectedFiles.value = selectedFiles.value.filter(file => file.id !== fileId)
  delete validationResults.value[fileId]
}

// 清空所有文件
const clearAllFiles = () => {
  selectedFiles.value = []
  validationResults.value = {}
}

// 开始重命名
const startRename = (file) => {
  file.isRenaming = true
  file.tempName = file.displayName
}

// 确认重命名
const confirmRename = (file) => {
  if (!file.tempName.trim()) {
    ElMessage.error('文件名不能为空')
    return
  }
  file.displayName = file.tempName.trim()
  file.isRenaming = false
  ElMessage.success('文件名修改成功')
}

// 取消重命名
const cancelRename = (file) => {
  file.isRenaming = false
  delete file.tempName
}

// 获取最终文件名
const getFinalFileName = (file) => {
  return `${file.displayName}.csv`
}

// 计算有效文件数量
const validFilesCount = computed(() => {
  return selectedFiles.value.filter(file => file.status === 'valid').length
})

// 计算无效文件数量
const invalidFilesCount = computed(() => {
  return selectedFiles.value.filter(file => file.status === 'invalid').length
})

// 移除所有无效文件
const removeInvalidFiles = () => {
  const invalidFiles = selectedFiles.value.filter(file => file.status === 'invalid')
  invalidFiles.forEach(file => {
    delete validationResults.value[file.id]
  })
  selectedFiles.value = selectedFiles.value.filter(file => file.status !== 'invalid')
  ElMessage.success(`已移除 ${invalidFiles.length} 个无效文件`)
}

// 批量上传
const handleBatchUpload = async () => {
  const validFiles = selectedFiles.value.filter(file => file.status === 'valid')
  
  if (validFiles.length === 0) {
    ElMessage.error('没有有效的文件可以上传')
    return
  }

  // 检查是否有文件正在重命名
  const renamingFile = validFiles.find(file => file.isRenaming)
  if (renamingFile) {
    ElMessage.error('请先完成文件重命名')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要上传 ${validFiles.length} 个有效文件吗？`,
      '确认上传',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
  } catch {
    return
  }

  uploadLoading.value = true
  let successCount = 0
  let failCount = 0

  try {
    for (const fileItem of validFiles) {
      try {
        const formData = new FormData()
        
        // 创建重命名后的文件
        const finalFileName = getFinalFileName(fileItem)
        const renamedFile = new File([fileItem.file], finalFileName, {
          type: 'text/csv'
        })

        formData.append('file', renamedFile)
        formData.append('operator', String(store.userId))
        formData.append('dataType', 'equipment_data')
        formData.append('format', 'csv')

        await axios.post('/api/device/data/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        successCount++
      } catch (error) {
        console.error(`文件 ${fileItem.displayName} 上传失败:`, error)
        failCount++
      }
    }

    if (successCount > 0) {
      ElMessage.success(`成功上传 ${successCount} 个文件`)
    }
    if (failCount > 0) {
      ElMessage.error(`${failCount} 个文件上传失败`)
    }

    // 如果全部成功，清空文件列表
    if (failCount === 0) {
      clearAllFiles()
    } else {
      // 只移除上传成功的文件
      const successFiles = validFiles.slice(0, successCount)
      successFiles.forEach(file => {
        removeFile(file.id)
      })
    }
  } catch (error) {
    console.error('批量上传失败:', error)
    ElMessage.error('批量上传失败')
  } finally {
    uploadLoading.value = false
  }
}
</script>

<template>
  <div class="csv-upload">
    <el-card shadow="hover" class="upload-card">
      <template #header>
        <div class="card-header">
          <span>电力设备数据集上传</span>
          <el-button
            v-if="selectedFiles.length > 0"
            type="danger"
            size="small"
            @click="clearAllFiles"
          >
            清空全部
          </el-button>
        </div>
      </template>

      <div class="upload-content">
        <!-- 格式说明 -->
        <el-card shadow="never" class="format-info-card">
          <template #header>
            <div class="format-header">
              <el-icon><document /></el-icon>
              <span>数据格式要求</span>
            </div>
          </template>
          
          <div class="format-requirements">
            <div class="requirement-item">
              <h4>文件格式：</h4>
              <p>仅支持 CSV 格式文件，编码为 UTF-8</p>
            </div>
            
            <div class="requirement-item">
              <h4>数据结构：</h4>
              <div class="data-structure-section">
                <!-- 左侧：列定义表格 -->
                <div class="table-structure">
                  <el-table :data="requiredColumns" size="small" border>
                    <el-table-column prop="name" label="列名" width="150" />
                    <el-table-column prop="label" label="说明" width="120" />
                    <el-table-column prop="type" label="数据类型" width="100">
                      <template #default="{ row }">
                        <el-tag size="small" :type="row.type === 'number' ? 'warning' : 'info'">
                          {{ row.type === 'number' ? '数字' : '文本' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- 右侧：实例数据表格 -->
                <div class="example-table">
                  <h5>实例数据：</h5>
                  <el-table :data="exampleData" size="small" border stripe>
                    <el-table-column prop="time_seconds" label="time_seconds" width="140">
                      <template #default="{ row }">
                        <span class="number-value">{{ row.time_seconds }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="equipment" label="equipment" width="80">
                      <template #default="{ row }">
                        <el-tag size="small" type="info">{{ row.equipment }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="voltage_V" label="voltage_V" width="100">
                      <template #default="{ row }">
                        <span class="number-value">{{ row.voltage_V }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="current1_A" label="current1_A" width="100">
                      <template #default="{ row }">
                        <span class="number-value">{{ row.current1_A }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="current2_A" label="current2_A" width="100">
                      <template #default="{ row }">
                        <span class="number-value">{{ row.current2_A }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>

            <div class="requirement-item">
              <h4>数据要求：</h4>
              <ul class="requirements-list">
                <li>时间戳必须为数字格式（秒为单位），支持科学记数法</li>
                <li>设备编号为字符串格式，如：A0, B0, Q0等</li>
                <li>电压和电流值必须为数字格式，可以为负值</li>
                <li>数据按时间戳升序排列</li>
                <li>文件编码必须为UTF-8</li>
              </ul>
            </div>
          </div>
        </el-card>

        <!-- 文件上传区域 -->
        <div class="upload-section">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept=".csv"
            multiple
            drag
          >
            <div class="upload-dragger">
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <p>将CSV文件拖拽到此处，或<em>点击选择文件</em></p>
                <p class="upload-tip">支持批量选择，单个文件不超过100MB</p>
                <p class="upload-format">格式要求：time_seconds,equipment,voltage_V,current1_A,current2_A</p>
              </div>
            </div>
          </el-upload>
        </div>

        <!-- 文件列表 -->
        <div v-if="selectedFiles.length > 0" class="file-list-section">
          <el-divider content-position="left">
            <span>文件列表</span>
            <div class="file-stats">
              <el-tag type="success" size="small">有效: {{ validFilesCount }}</el-tag>
              <el-tag type="danger" size="small" v-if="invalidFilesCount > 0">无效: {{ invalidFilesCount }}</el-tag>
              <el-tag type="info" size="small">总计: {{ selectedFiles.length }}</el-tag>
            </div>
          </el-divider>

          <!-- 操作按钮栏 -->
          <div class="list-actions">
            <el-button
              v-if="invalidFilesCount > 0"
              type="warning"
              size="small"
              @click="removeInvalidFiles"
            >
              移除无效文件 ({{ invalidFilesCount }})
            </el-button>
          </div>

          <div class="file-list">
            <div 
              v-for="file in selectedFiles" 
              :key="file.id" 
              class="file-item"
              :class="{
                'file-valid': file.status === 'valid',
                'file-invalid': file.status === 'invalid',
                'file-validating': file.status === 'validating'
              }"
            >
              <div class="file-main-info">
                <div class="file-icon-section">
                  <el-icon class="file-icon">
                    <document v-if="file.status === 'valid'" />
                    <warning v-else-if="file.status === 'invalid'" />
                    <loading v-else />
                  </el-icon>
                  <div class="file-status-indicator">
                    <el-tag 
                      size="small" 
                      :type="file.status === 'valid' ? 'success' : file.status === 'invalid' ? 'danger' : 'info'"
                    >
                      {{ file.status === 'valid' ? '有效' : file.status === 'invalid' ? '无效' : '验证中' }}
                    </el-tag>
                  </div>
                </div>

                <!-- 文件名显示/编辑 -->
                <div class="file-name-section">
                  <div v-if="!file.isRenaming" class="file-name-display">
                    <span 
                      class="file-name" 
                      @dblclick="startRename(file)"
                      :title="'双击修改文件名'"
                    >
                      {{ getFinalFileName(file) }}
                    </span>
                    <div class="file-meta">
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      <span v-if="validationResults[file.id]?.rows" class="data-rows">
                        {{ validationResults[file.id].rows }} 行数据
                      </span>
                    </div>
                  </div>

                  <div v-else class="file-name-edit">
                    <el-input
                      v-model="file.tempName"
                      size="small"
                      style="width: 200px"
                      @keyup.enter="confirmRename(file)"
                      @keyup.esc="cancelRename(file)"
                    />
                    <span class="file-extension">.csv</span>
                    <el-button size="small" type="primary" @click="confirmRename(file)">
                      确定
                    </el-button>
                    <el-button size="small" @click="cancelRename(file)">
                      取消
                    </el-button>
                  </div>
                </div>

                <div class="file-actions">
                  <el-button
                    v-if="!file.isRenaming && file.status === 'valid'"
                    size="small"
                    type="primary"
                    text
                    @click="startRename(file)"
                  >
                    重命名
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    text 
                    @click="removeFile(file.id)"
                  >
                    删除
                  </el-button>
                </div>
              </div>

              <!-- 验证结果详情 -->
              <div v-if="validationResults[file.id]" class="validation-details">
                <div v-if="file.status === 'invalid'" class="error-message">
                  <el-icon><warning /></el-icon>
                  <span>{{ validationResults[file.id].error }}</span>
                </div>
                
                <div v-else-if="file.status === 'valid'" class="success-info">
                  <div class="preview-data">
                    <el-text class="preview-title">数据预览：</el-text>
                    <el-text tag="pre" class="data-preview">{{ validationResults[file.id].preview?.join('\n') }}</el-text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button
            type="primary"
            size="large"
            :loading="uploadLoading"
            :disabled="validFilesCount === 0"
            @click="handleBatchUpload"
          >
            <el-icon><upload /></el-icon>
            批量上传 ({{ validFilesCount }} 个有效文件)
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.csv-upload {
  padding: 20px;
  background-color: #f7f8fa; /* 更柔和的背景色 */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.upload-card {
  flex: 1;
  display: flex !important;
  flex-direction: column;
  border: none; /* 移除卡片外边框 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 更柔和的阴影 */
}

:deep(.upload-card .el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.upload-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

/* --- 格式说明区域 --- */
.format-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.format-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-weight: 600;
}

.format-requirements {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.requirement-item h4 {
  margin: 0 0 8px 0;
  color: #343a40;
  font-size: 14px;
}

.requirement-item p {
  margin: 0;
  color: #6c757d;
  font-size: 13px;
}

.data-structure-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.table-structure {
  flex-shrink: 0;
}

.example-table {
  flex: 1;
}

.example-table h5 {
  margin: 0 0 12px 0;
  color: #343a40;
  font-size: 13px;
  font-weight: 600;
}

.number-value {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #e6a23c;
  font-weight: 500;
}

.requirements-list {
  margin: 0;
  padding-left: 20px;
  color: #6c757d;
  font-size: 13px;
}

.requirements-list li {
  margin-bottom: 4px;
  line-height: 1.4;
}

/* --- 上传区域 --- */
.upload-section {
  margin-bottom: 8px;
}

.upload-dragger {
  padding: 32px; /* 增加内边距 */
  text-align: center;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  transition: border-color 0.3s, background-color 0.3s;
  background-color: #fff;
}

.upload-dragger:hover {
  border-color: #409eff;
  background-color: #f5faff; /* 悬停时增加背景色 */
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px; /* 调整字体大小 */
}

.upload-text em {
  color: #409eff;
  font-style: normal;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

.upload-format {
  font-size: 12px;
  color: #409eff;
  font-family: 'Courier New', monospace;
  background: #ecf5ff;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 8px; /* 增加上边距 */
}

/* --- 文件列表区域 --- */
.file-list-section {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed; /* 增加细边框 */
}

.file-stats {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.list-actions {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 增加文件间距 */
  flex: 1;
  overflow-y: auto;
  padding-right: 8px; /* 为滚动条留出空间 */
}

.file-item {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.file-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.file-item.file-valid {
  border-left: 4px solid #67c23a;
}

.file-item.file-invalid {
  border-left: 4px solid #f56c6c;
}

.file-item.file-validating {
  border-left: 4px solid #e6a23c;
}

.file-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-size: 24px;
}

.file-valid .file-icon { color: #67c23a; }
.file-invalid .file-icon { color: #f56c6c; }
.file-validating .file-icon { color: #e6a23c; }

.file-name-section {
  flex: 1;
  min-width: 0; /* 防止 flex 溢出 */
}

.file-name-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-weight: 500;
  color: #303133;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.file-name:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.file-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.file-name-edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-extension {
  color: #909399;
  font-size: 14px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

/* --- 验证结果详情 --- */
.validation-details {
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  border-top: 1px solid #ebeef5;
}

.file-invalid .validation-details {
  background-color: #fef0f0;
}

.file-valid .validation-details {
  background-color: #f0f9eb;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f56c6c;
  font-size: 13px;
}

.preview-data {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-title {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.data-preview {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #303133;
  background: #fff;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  line-height: 1.3;
  max-height: 120px;
  overflow-y: auto;
}

/* --- 操作按钮区域 --- */
.action-section {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  margin-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* --- Element Plus 样式覆盖 --- */
:deep(.el-upload-dragger) {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
}

:deep(.el-upload-dragger:hover) {
  background: transparent;
}

/* --- 响应式设计 --- */
@media (max-width: 1200px) {
  .data-structure-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .table-structure {
    align-self: stretch; /* 在垂直布局时占满宽度 */
  }
}
</style>