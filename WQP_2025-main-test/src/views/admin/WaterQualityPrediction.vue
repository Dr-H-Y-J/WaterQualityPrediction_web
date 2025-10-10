<template>
  <div class="water-quality-container">
    <el-card class="detection-card">
      <template #header>
        <div class="card-header">
          <span>水质预测系统</span>
        </div>
      </template>

      <el-steps :active="step - 1" finish-status="success" simple>
        <el-step title="数据选择/上传" />
        <el-step title="选择模型" />
        <el-step title="水质预测" />
      </el-steps>

      <div class="step-content">
        <transition name="el-fade-in" mode="out-in">
          <div :key="step">
            <!-- Step 1: Data Selection/Upload -->
            <div v-if="step === 1" class="data-upload-step">
              <el-tabs v-model="dataTab" type="border-card">
                <!-- 数据选择标签页 -->
                <el-tab-pane label="选择已有数据" name="select">
                  <div class="existing-data-section">
                    <el-table 
                      :data="existingDataList" 
                      style="width: 100%" 
                      v-loading="dataListLoading"
                      @selection-change="handleDataSelectionChange"
                    >
                      <el-table-column type="selection" width="55" />
                      <el-table-column prop="name" label="数据名称" />
                      <el-table-column prop="description" label="描述" />
                      <el-table-column prop="createTime" label="创建时间" width="180" />
                      <el-table-column prop="dataCount" label="数据量" width="100" />
                      <el-table-column label="操作" width="120">
                        <template #default="{ row }">
                          <el-button size="small" type="primary" @click="previewData(row)">
                            预览
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    
                    <div class="data-pagination">
                      <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50]"
                        :total="totalDataItems"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                      />
                    </div>
                  </div>
                </el-tab-pane>
                
                <!-- 数据上传标签页 -->
                <el-tab-pane label="上传数据" name="upload">
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
                              <el-table-column prop="date" label="date" width="140">
                                <template #default="{ row }">
                                  <span class="number-value">{{ row.date }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column prop="temperature" label="temperature" width="100">
                                <template #default="{ row }">
                                  <span class="number-value">{{ row.temperature }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column prop="pH" label="pH" width="80">
                                <template #default="{ row }">
                                  <span class="number-value">{{ row.pH }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column prop="O2" label="O2" width="80">
                                <template #default="{ row }">
                                  <span class="number-value">{{ row.O2 }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column prop="NTU" label="NTU" width="80">
                                <template #default="{ row }">
                                  <span class="number-value">{{ row.NTU }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column prop="uS" label="uS" width="80">
                                <template #default="{ row }">
                                  <span class="number-value">{{ row.uS }}</span>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>

                      <div class="requirement-item">
                        <h4>数据要求：</h4>
                        <ul class="requirements-list">
                          <li>日期格式为 YYYY-MM-DD HH，小时为00-23</li>
                          <li>温度单位为摄氏度(℃)</li>
                          <li>pH值范围通常在0-14之间</li>
                          <li>溶解氧(O2)单位为mg/L</li>
                          <li>浊度(NTU)单位为NTU</li>
                          <li>电导率(uS)单位为微西门子/厘米(μS/cm)</li>
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
                      drag
                    >
                      <div class="upload-dragger">
                        <el-icon class="upload-icon"><upload-filled /></el-icon>
                        <div class="upload-text">
                          <p>将CSV文件拖拽到此处，或<em>点击选择文件</em></p>
                          <p class="upload-tip">单个文件不超过100MB</p>
                          <p class="upload-format">格式要求：date,temperature,pH,O2,NTU,uS</p>
                        </div>
                      </div>
                    </el-upload>
                  </div>

                  <!-- 文件信息 -->
                  <div v-if="selectedFiles.length > 0" class="file-info-section">
                    <el-card shadow="never" class="file-info-card">
                      <div class="file-info-header">
                        <el-icon class="file-info-icon">
                          <document v-if="selectedFiles[0].status === 'valid'" />
                          <warning v-else-if="selectedFiles[0].status === 'invalid'" />
                          <loading v-else />
                        </el-icon>
                        <div class="file-info-details">
                          <div class="file-info-name">{{ selectedFiles[0].name }}</div>
                          <div class="file-info-meta">
                            <span class="file-size">{{ formatFileSize(selectedFiles[0].size) }}</span>
                            <el-tag
                              size="small"
                              :type="selectedFiles[0].status === 'valid' ? 'success' : selectedFiles[0].status === 'invalid' ? 'danger' : 'info'"
                            >
                              {{ selectedFiles[0].status === 'valid' ? '验证通过' : selectedFiles[0].status === 'invalid' ? '验证失败' : '验证中' }}
                            </el-tag>
                            <span v-if="validationResults[selectedFiles[0].id]?.rows" class="data-rows">
                              {{ validationResults[selectedFiles[0].id].rows }} 行数据
                            </span>
                          </div>
                        </div>
                        <el-button
                          size="small"
                          type="danger"
                          @click="clearAllFiles"
                        >
                          删除文件
                        </el-button>
                      </div>

                      <!-- 验证结果详情 -->
                      <div v-if="validationResults[selectedFiles[0].id]" class="validation-details">
                        <div v-if="selectedFiles[0].status === 'invalid'" class="error-message">
                          <el-icon><warning /></el-icon>
                          <span>{{ validationResults[selectedFiles[0].id].error }}</span>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- Step 2: Model Selection -->
            <el-form
              v-if="step === 2"
              :model="detectionConfig"
              label-width="140px"
              label-position="right"
            >
              <el-form-item label="选择模型:" prop="model">
                <el-select
                  v-model="detectionConfig.model"
                  placeholder="请选择一个模型"
                  style="width: 100%"
                  @change="onModelChange"
                >
                  <el-option label="水质预测模型-LSTM" value="LSTM" />
                  <el-option label="水质预测模型-RNN" value="RNN" />
                </el-select>
              </el-form-item>

              <el-form-item v-if="detectionConfig.model" label="选择权重文件:" prop="weights">
                <el-select
                  v-model="detectionConfig.weights"
                  placeholder="请选择权重文件"
                  style="width: 100%"
                  :loading="weightsLoading"
                >
                  <el-option
                    v-for="weight in availableWeights"
                    :key="weight.value"
                    :label="weight.label"
                    :value="weight.value"
                  />
                </el-select>
              </el-form-item>

            </el-form>

            <!-- Step 3: Water Quality Prediction -->
            <div v-if="step === 3" class="detection-config">
              <el-descriptions title="确认预测信息" :column="1" border>
                <el-descriptions-item label="数据来源">
                  {{ dataTab === 'upload' ? '文件上传' : '已有数据' }}
                </el-descriptions-item>
                <el-descriptions-item v-if="dataTab === 'select' && selectedExistingData.length > 0" label="选择的数据">
                  {{ selectedExistingData.map(item => item.name).join(', ') }}
                </el-descriptions-item>
                <el-descriptions-item v-if="dataTab === 'upload' && validFilesCount > 0" label="数据文件">{{
                  validFilesCount
                }} 个有效文件</el-descriptions-item>
                <el-descriptions-item label="模型类型">{{
                  detectionConfig.model
                }}</el-descriptions-item>
                <el-descriptions-item label="权重文件">{{
                  detectionConfig.weights
                }}</el-descriptions-item>
                <el-descriptions-item label="总数据行数">{{
                  3467
                }}</el-descriptions-item>
              </el-descriptions>

              <div class="detection-options">
                <h3>预测选项</h3>
                <el-form :model="detectionOptions" label-width="140px">
                  <el-form-item label="预测时长:">
                  <el-input-number
                    v-model="detectionOptions.predictionHours"
                    :min="1"
                    :max="168"
                    controls-position="right"
                    style="width: 200px"
                  /> 小时 (1-168小时)
                  <div class="threshold-info">
                    <span class="threshold-desc">预测未来1小时到168小时(7天)的水质数据</span>
                  </div>
                </el-form-item>

                  <el-form-item label="批处理大小:">
                    <el-input-number
                      v-model="detectionOptions.batchSize"
                      :min="1"
                      :max="1000"
                      controls-position="right"
                      style="width: 200px"
                    />
                  </el-form-item>
                </el-form>
                
                <div class="results-preview" v-if="detectionResults">
                  <h4>预测结果预览（前5行）：</h4>
                  <el-table :data="detectionResults.previewData" size="small" border stripe>
                    <el-table-column prop="date" label="日期" width="150" />
                    <el-table-column prop="temperature" label="温度(℃)" width="100" />
                    <el-table-column prop="pH" label="pH值" width="80" />
                    <el-table-column prop="O2" label="溶解氧(mg/L)" width="120" />
                    <el-table-column prop="NTU" label="浊度(NTU)" width="100" />
                    <el-table-column prop="uS" label="电导率(μS/cm)" width="120" />
                    <el-table-column prop="quality" label="水质状态" width="100">
                      <template #default="{ row }">
                        <el-tag 
                          size="small" 
                          :type="row.quality === '正常' ? 'success' : row.quality === '警告' ? 'warning' : 'danger'"
                        >
                          {{ row.quality }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                
                <div class="results-actions" v-if="detectionResults">
                  <el-button type="primary" @click="downloadResults">
                    <el-icon><download /></el-icon>
                    下载CSV结果
                  </el-button>
                  <el-button @click="resetDetection">重新预测</el-button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="navigation-buttons">
        <el-button v-if="step > 1" @click="prevStep">上一步</el-button>
        <el-button 
          v-if="step < 3" 
          type="primary" 
          @click="nextStep" 
          :disabled="!canGoNext"
        >
          下一步
        </el-button>
        <el-button 
          v-if="step === 3" 
          type="success" 
          @click="startDetection" 
          :loading="detecting" 
          :disabled="!canStartDetection"
        >
          {{ detecting ? '预测中...' : '开始预测' }}
        </el-button>
      </div>
    </el-card>

    <!-- 数据预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="数据预览"
      width="80%"
      top="5vh"
    >
      <el-table 
        :data="previewDataList" 
        height="400"
        v-loading="previewLoading"
      >
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="temperature" label="温度(℃)" />
        <el-table-column prop="pH" label="pH值" />
        <el-table-column prop="O2" label="溶解氧(mg/L)" />
        <el-table-column prop="NTU" label="浊度(NTU)" />
        <el-table-column prop="uS" label="电导率(μS/cm)" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Warning, Loading, UploadFilled, Download } from '@element-plus/icons-vue'

// 步骤控制
const step = ref(1)
const weightsLoading = ref(false)
const detecting = ref(false)
const detectionCompleted = ref(false) // 新增：标记预测是否完成

// 数据选择相关
const dataTab = ref('select') // 'upload' 或 'select'，默认改为选择数据
const selectedExistingData = ref([]) // 选择的已有数据
const existingDataList = ref([
  { id: 1, name: '2023年水质数据', description: '2023年全年水质监测数据', createTime: '2023-12-31 23:59:59', dataCount: 8760 },
  { id: 2, name: '春季水质样本', description: '春季水质监测样本数据', createTime: '2024-03-31 23:59:59', dataCount: 2160 },
  { id: 3, name: '夏季水质样本', description: '夏季水质监测样本数据', createTime: '2024-06-30 23:59:59', dataCount: 2200 },
  { id: 4, name: '秋季水质样本', description: '秋季水质监测样本数据', createTime: '2024-09-30 23:59:59', dataCount: 2100 },
  { id: 5, name: '冬季水质样本', description: '冬季水质监测样本数据', createTime: '2024-12-31 23:59:59', dataCount: 2000 },
])
const dataListLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalDataItems = ref(25)

// 预览相关
const previewDialogVisible = ref(false)
const previewDataItem = ref(null)
const previewDataList = ref([])
const previewLoading = ref(false)

// 数据上传相关状态
const selectedFiles = ref([])
const validationResults = ref({})

// 检测配置
const detectionConfig = reactive({
  model: '',
  weights: '',
})

// 检测选项
const detectionOptions = reactive({
  predictionHours: 24,
  batchSize: 64,
})

// 检测结果
const detectionResults = ref(null)

// 水质指标要求的格式
const requiredColumns = [
  { name: 'date', label: '日期时间', type: 'string' },
  { name: 'temperature', label: '温度(℃)', type: 'number' },
  { name: 'pH', label: '酸碱度', type: 'number' },
  { name: 'O2', label: '溶解氧(mg/L)', type: 'number' },
  { name: 'NTU', label: '浊度(NTU)', type: 'number' },
  { name: 'uS', label: '电导率(μS/cm)', type: 'number' }
]

// 示例数据
const exampleData = [
  { date: '2020-01-01 00', temperature: '12.4', pH: '7.83', O2: '12.63', NTU: '8', uS: '254.7' },
  { date: '2020-01-01 01', temperature: '12', pH: '7.84', O2: '13.43', NTU: '10.3', uS: '255.3' },
  { date: '2020-01-01 02', temperature: '12', pH: '7.83', O2: '13.49', NTU: '9.7', uS: '255.5' },
  { date: '2020-01-01 03', temperature: '12', pH: '7.83', O2: '13.33', NTU: '8.7', uS: '255.9' },
  { date: '2020-01-01 04', temperature: '12.3', pH: '7.81', O2: '12.48', NTU: '7.6', uS: '254.9' },
  { date: '2020-01-01 05', temperature: '12', pH: '7.81', O2: '13.23', NTU: '10.3', uS: '255.6' }
]

// Mock data for available weights
const mockWeights = {
  LSTM: [
    {
      label: '水质预测 lstm_v1.0',
      value: 'lstm_v1_0',
      accuracy: '95.2%',
      trainDate: '2024-08-10',
    },
    { label: '水质预测 lstm_best_model', value: 'lstm_best', accuracy: '96.8%', trainDate: '2024-08-12' },
    {
      label: '水质预测 lstm_checkpoint_100',
      value: 'lstm_cp100',
      accuracy: '94.5%',
      trainDate: '2024-08-08',
    },
  ],
  RNN: [
    {
      label: '水质预测 rnn_v2.1',
      value: 'rnn_v2_1',
      accuracy: '93.1%',
      trainDate: '2024-08-14',
    },
    {
      label: '水质预测 rnn_stable',
      value: 'rnn_stable',
      accuracy: '92.3%',
      trainDate: '2024-08-11',
    },
  ],
}

// 计算属性
const availableWeights = computed(() => {
  if (!detectionConfig.model) return []
  return mockWeights[detectionConfig.model] || []
})

const validFilesCount = computed(() => {
  return selectedFiles.value.filter(file => file.status === 'valid').length
})

const invalidFilesCount = computed(() => {
  return selectedFiles.value.filter(file => file.status === 'invalid').length
})

const totalDataRows = computed(() => {
  return selectedFiles.value
    .filter(file => file.status === 'valid')
    .reduce((total, file) => total + (validationResults.value[file.id]?.rows || 0), 0)
})

const canGoNext = computed(() => {
  if (step.value === 1) {
    // 如果是上传数据标签页，需要有有效文件
    if (dataTab.value === 'upload') {
      return validFilesCount.value > 0
    }
    // 如果是选择数据标签页，需要有选中数据
    else if (dataTab.value === 'select') {
      return selectedExistingData.value.length > 0
    }
    return false
  }
  if (step.value === 2) {
    // 修改：只有选择了模型和权重才能下一步
    return detectionConfig.model && detectionConfig.weights
  }
  return false
})

const canStartDetection = computed(() => {
  // 检查数据来源
  const hasData = (dataTab.value === 'upload' && validFilesCount.value > 0) || 
                  (dataTab.value === 'select' && selectedExistingData.value.length > 0)
  
  return hasData && detectionConfig.model && detectionConfig.weights
})

// 文件大小格式化
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 文件选择处理
const handleFileChange = (uploadFile) => {
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

  // 如果已有文件，先清除
  if (selectedFiles.value.length > 0) {
    clearAllFiles()
  }

  const fileItem = {
    id: Date.now() + Math.random(),
    file: file,
    name: file.name,
    size: file.size,
    status: 'valid'
  }

  selectedFiles.value.push(fileItem)
  
  // 直接标记为验证通过，不进行实际验证
  validationResults.value[fileItem.id] = {
    valid: true,
    rows: 0, // 暂时设为0，实际使用时再计算
    preview: [] // 空预览
  }
  
  ElMessage.success(`${file.name} 上传成功`)
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

// 移除所有无效文件
const removeInvalidFiles = () => {
  const invalidFiles = selectedFiles.value.filter(file => file.status === 'invalid')
  invalidFiles.forEach(file => {
    delete validationResults.value[file.id]
  })
  selectedFiles.value = selectedFiles.value.filter(file => file.status !== 'invalid')
  ElMessage.success(`已移除 ${invalidFiles.length} 个无效文件`)
}

// 获取权重信息
const getWeightsInfo = (weightsValue) => {
  const allWeights = [...(mockWeights.LSTM || []), ...(mockWeights.RNN || [])]
  const weight = allWeights.find((w) => w.value === weightsValue)
  if (!weight) return []

  return [
    { key: '准确率', value: weight.accuracy },
    { key: '训练日期', value: weight.trainDate },
    { key: '文件名', value: weight.label },
  ]
}

// 模型变化处理
const onModelChange = () => {
  detectionConfig.weights = ''
  weightsLoading.value = true
  // Simulate loading weights
  setTimeout(() => {
    weightsLoading.value = false
  }, 500)
}

// 步骤导航
const nextStep = () => {
  if (step.value < 3) {
    step.value++
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

// 处理数据选择变化
const handleDataSelectionChange = (selection) => {
  selectedExistingData.value = selection
}

// 预览数据
const previewData = (dataItem) => {
  previewDataItem.value = dataItem
  previewDialogVisible.value = true
  previewLoading.value = true
  
  // 模拟获取数据
  setTimeout(() => {
    previewDataList.value = [
      { date: '2023-01-01 00', temperature: '12.4', pH: '7.83', O2: '12.63', NTU: '8', uS: '254.7' },
      { date: '2023-01-01 01', temperature: '12', pH: '7.84', O2: '13.43', NTU: '10.3', uS: '255.3' },
      { date: '2023-01-01 02', temperature: '12', pH: '7.83', O2: '13.49', NTU: '9.7', uS: '255.5' },
      { date: '2023-01-01 03', temperature: '12', pH: '7.83', O2: '13.33', NTU: '8.7', uS: '255.9' },
      { date: '2023-01-01 04', temperature: '12.3', pH: '7.81', O2: '12.48', NTU: '7.6', uS: '254.9' },
    ]
    previewLoading.value = false
  }, 800)
}

// 分页相关
const handleSizeChange = (val) => {
  pageSize.value = val
  // 这里应该重新获取数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 这里应该重新获取数据
}

// 开始水质预测
const startDetection = async () => {
  try {
    detecting.value = true

    // 模拟检测过程
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // 生成模拟检测结果
    const totalSamples = totalDataRows.value
    const faultCount = Math.floor(totalSamples * 0.05) // 假设5%的数据点异常
    const faultRate = (faultCount / totalSamples * 100)

    // 生成预览数据 - 使用固定的前五行数据
    const previewData = [
      {
        date: '2025-04-01 00',
        temperature: '18.2',
        pH: '7.2',
        O2: '5.2',
        NTU: '15.3',
        uS: '1850',
        quality: '警告'
      },
      {
        date: '2025-04-01 01',
        temperature: '18.4',
        pH: '7.1',
        O2: '5.1',
        NTU: '16.2',
        uS: '1875',
        quality: '异常'
      },
      {
        date: '2025-04-01 02',
        temperature: '18.6',
        pH: '7.0',
        O2: '4.9',
        NTU: '17.1',
        uS: '1902',
        quality: '异常'
      },
      {
        date: '2025-04-01 03',
        temperature: '18.8',
        pH: '6.9',
        O2: '4.8',
        NTU: '18.3',
        uS: '1930',
        quality: '异常'
      },
      {
        date: '2025-04-01 04',
        temperature: '18.7',
        pH: '6.8',
        O2: '4.7',
        NTU: '19.2',
        uS: '1955',
        quality: '异常'
      }
    ]

    detectionResults.value = {
      totalSamples,
      faultCount,
      faultRate,
      processingTime: Math.floor(Math.random() * 2000) + 1000,
      previewData,
      allData: [] // 这里会包含所有处理后的数据
    }

    // 设置预测完成标志
    detectionCompleted.value = true
    
    ElMessage.success('预测完成！')
  } catch (error) {
    ElMessage.error('预测过程中出现错误')
    console.error(error)
  } finally {
    detecting.value = false
  }
}

// 下载结果
const downloadResults = () => {
  if (!detectionResults.value) return

  // 生成CSV内容
  const headers = [...requiredColumns.map(col => col.name), 'quality']
  const csvContent = [
    headers.join(','),
    ...detectionResults.value.previewData.map(row => 
      headers.map(header => row[header]).join(',')
    )
  ].join('\n')

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `water_quality_prediction_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  ElMessage.success('结果文件已下载')
}

// 重置检测
const resetDetection = () => {
  detectionResults.value = null
  detectionCompleted.value = false
}
</script>

<style scoped>
.water-quality-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 40px);
  min-width: 1200px;
}

.detection-card {
  width: 100%;
  max-width: 1200px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.el-steps {
  margin: 20px 0;
}

.step-content {
  margin-top: 40px;
  min-height: 400px;
}

/* --- 数据上传步骤样式 --- */
.format-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  margin-bottom: 24px;
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

.upload-section {
  margin-bottom: 24px;
}

.upload-dragger {
  padding: 32px;
  text-align: center;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  transition: border-color 0.3s, background-color 0.3s;
  background-color: #fff;
}

.upload-dragger:hover {
  border-color: #409eff;
  background-color: #f5faff;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
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
  margin-top: 8px;
}

.file-info-section {
  margin-top: 24px;
}

.file-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.file-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-info-icon {
  font-size: 32px;
  color: #409eff;
}

.file-valid .file-info-icon { color: #67c23a; }
.file-invalid .file-info-icon { color: #f56c6c; }
.file-validating .file-info-icon { color: #e6a23c; }

.file-info-details {
  flex: 1;
}

.file-info-name {
  font-weight: 500;
  color: #303133;
  font-size: 16px;
  margin-bottom: 4px;
}

.file-info-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

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

/* --- 数据选择样式 --- */
.existing-data-section {
  padding: 20px 0;
}

.data-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* --- 模型选择步骤样式 --- */
.weights-info {
  background-color: #f9f9f9;
  margin-top: 10px;
}

.weights-info p {
  margin: 8px 0;
  line-height: 1.6;
}

.dataset-info {
  background-color: #f9f9f9;
  margin-top: 10px;
}

.dataset-info p {
  margin: 8px 0;
  line-height: 1.6;
}

/* --- 故障检测步骤样式 --- */
.detection-config {
  space-y: 20px;
}

.detection-options {
  margin-top: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 6px;
}

.detection-options h3 {
  margin-bottom: 15px;
  color: #606266;
  font-size: 16px;
}

.threshold-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.threshold-desc {
  font-style: italic;
}

/* --- 结果步骤样式 --- */
.results-preview {
  margin: 20px 0;
}

.results-preview h4 {
  margin-bottom: 12px;
  color: #606266;
}

.results-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* --- 通用样式 --- */
.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

/* --- 响应式设计 --- */
@media (max-width: 1200px) {
  .data-structure-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .table-structure {
    align-self: stretch;
  }
}
</style>