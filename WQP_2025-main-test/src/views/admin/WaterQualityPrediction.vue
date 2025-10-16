<template>
  <div class="water-quality-container">
    <el-card class="detection-card">
      <template #header>
        <div class="card-header">
          <span>水质预测系统</span>
        </div>
      </template>

      <el-steps :active="step - 1" finish-status="success" simple>
        <el-step title="数据选择" />
        <el-step title="选择模型" />
        <el-step title="水质预测" />
      </el-steps>

      <div class="step-content">
        <transition name="el-fade-in" mode="out-in">
          <div :key="step">
            <!-- Step 1: Data Selection -->
            <div v-if="step === 1" class="data-upload-step">
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
                  <!-- 移除创建时间列 -->
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
                  :disabled="true"
                >
                  <el-option label="水质预测模型-R-Informer" value="R-Informer" />
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
                  已有数据
                </el-descriptions-item>
                <el-descriptions-item v-if="selectedExistingData.length > 0" label="选择的数据">
                  {{ selectedExistingData.map(item => item.name).join(', ') }}
                </el-descriptions-item>
                <el-descriptions-item label="模型类型">{{
                  detectionConfig.model
                }}</el-descriptions-item>
                <el-descriptions-item label="权重文件">{{
                  detectionConfig.weights
                }}</el-descriptions-item>
                <el-descriptions-item label="总数据行数">{{
                  totalDataRows
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
                    <!-- 动态生成表格列 -->
                    <el-table-column 
                      v-for="column in resultPreviewColumns" 
                      :key="column.name"
                      :prop="column.name" 
                      :label="column.label" 
                      :width="getColumnWidth(column.name)"
                    >
                      <template #default="{ row }" v-if="column.name === 'quality'">
                        <el-tag 
                          size="small" 
                          :type="getQualityTagType(row.quality)"
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
        <!-- 动态生成列 -->
        <el-table-column 
          v-for="column in previewColumns"
          :key="column.name"
          :prop="column.name"
          :label="column.label"
        />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Warning, Loading, UploadFilled, Download } from '@element-plus/icons-vue'
import axios from 'axios'

// API基础URL
const API_BASE_URL = '/api'

// 步骤控制
const step = ref(1)
const weightsLoading = ref(false)
const detecting = ref(false)
const detectionCompleted = ref(false) // 新增：标记预测是否完成

// 数据选择相关
const selectedExistingData = ref([]) // 选择的已有数据
const existingDataList = ref([])
const dataListLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalDataItems = ref(0)

// 预览相关
const previewDialogVisible = ref(false)
const previewDataItem = ref(null)
const previewDataList = ref([])
const previewLoading = ref(false)

// 获取列标签
const getColumnLabel = (key) => {
  const columnMap = {
    'date': '日期',
    'temperature': '温度(℃)',
    'pH': 'pH值',
    'O2': '溶解氧(mg/L)',
    'NTU': '浊度(NTU)',
    'uS': '电导率(μS/cm)',
    'quality': '水质状态'
  }
  return columnMap[key] || key
}

// 获取列宽度
const getColumnWidth = (columnName) => {
  const widthMap = {
    'date': 180,
    'temperature': 100,
    'pH': 80,
    'O2': 120,
    'NTU': 100,
    'uS': 120,
    'quality': 100
  }
  return widthMap[columnName] || 100
}

// 获取水质状态标签类型
const getQualityTagType = (quality) => {
  switch (quality) {
    case '正常': return 'success'
    case '警告': return 'warning'
    case '危险': return 'danger'
    default: return ''
  }
}

// 预览列定义
const previewColumns = computed(() => {
  if (previewDataList.value.length > 0) {
    return Object.keys(previewDataList.value[0]).map(key => ({
      name: key,
      label: getColumnLabel(key)
    }))
  }
  return []
})

// 结果预览列定义
const resultPreviewColumns = computed(() => {
  if (detectionResults.value && detectionResults.value.previewData.length > 0) {
    const firstRow = detectionResults.value.previewData[0]
    return Object.keys(firstRow).map(key => ({
      name: key,
      label: getColumnLabel(key)
    }))
  }
  return []
})

// 日期格式化函数
const formatDateTime = (dateString) => {
  if (!dateString) return '未知时间';
  
  try {
    const date = new Date(dateString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) return '无效时间';
    
    // 格式化为 YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '格式错误';
  }
};

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

const mockWeights = {
  'R-Informer': [
    {
      label: '水质预测 R-Informer v1.0',
      value: 'r_informer_v1_0',
      accuracy: '97.2%',
      trainDate: '2024-09-15',
    },
    { 
      label: '水质预测 R-Informer best_model', 
      value: 'r_informer_best', 
      accuracy: '98.1%', 
      trainDate: '2024-09-20' 
    },
    {
      label: '水质预测 R-Informer checkpoint_200',
      value: 'r_informer_cp200',
      accuracy: '96.8%',
      trainDate: '2024-09-10',
    },
  ],
}

// 计算属性
const availableWeights = computed(() => {
  if (!detectionConfig.model) return []
  return mockWeights[detectionConfig.model] || []
})

const totalDataRows = computed(() => {
  return selectedExistingData.value.reduce((total, item) => total + item.dataCount, 0)
})

const canGoNext = computed(() => {
  if (step.value === 1) {
    // 需要有选中数据
    return selectedExistingData.value.length > 0
  }
  if (step.value === 2) {
    // 修改：只有选择了模型和权重才能下一步
    return detectionConfig.model && detectionConfig.weights
  }
  return false
})

const canStartDetection = computed(() => {
  // 检查数据来源
  const hasData = selectedExistingData.value.length > 0
  
  return hasData && detectionConfig.model && detectionConfig.weights
})

// 获取权重信息
const getWeightsInfo = (weightsValue) => {
  const allWeights = [...(mockWeights.LSTM || []), ...(mockWeights.RNN || []), ...(mockWeights['R-Informer'] || [])]
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
    // 默认选择第一个权重
    if (availableWeights.value.length > 0) {
      detectionConfig.weights = availableWeights.value[0].value
    }
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

// 获取数据集列表
const fetchDatasets = async () => {
  try {
    dataListLoading.value = true
    const response = await axios.get(`${API_BASE_URL}/water-quality/datasets`)
    existingDataList.value = response.data.datasets.map(item => ({
      id: item.id,
      name: item.table_name,
      description: item.description || '暂无描述',
      // 移除创建时间
      dataCount: item.row_count || 0
    }))
    totalDataItems.value = response.data.total || response.data.datasets.length
  } catch (error) {
    console.error('获取数据集失败:', error)
    // 使用mock数据作为备选方案
    existingDataList.value = [
      {
        id: 1,
        name: 'water_data_2023',
        description: '2023年水质监测数据',
        // 移除创建时间
        dataCount: 8760
      },
      {
        id: 2,
        name: 'water_data_2024_q1',
        description: '2024年第一季度水质数据',
        // 移除创建时间
        dataCount: 2160
      }
    ]
    totalDataItems.value = existingDataList.value.length
    ElMessage.warning('无法连接到数据服务，显示模拟数据')
  } finally {
    dataListLoading.value = false
  }
}

// 预览数据
const previewData = async (dataItem) => {
  previewDialogVisible.value = true
  previewLoading.value = true

  try {
    // 调用新的预览接口
    const response = await axios.get(`${API_BASE_URL}/water-quality/datasets/${dataItem.name}/preview`, {
      params: { limit: 50 }
    })
    
    // 确保数据格式正确
    if (response.data && Array.isArray(response.data.rows)) {
      previewDataList.value = response.data.rows
    } else {
      throw new Error('数据格式不正确')
    }
    
    ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('加载数据失败:', error)
    
    // 提供模拟数据用于演示
    previewDataList.value = [
      {
        date: '2024-01-01 00:00:00',
        temperature: '18.5',
        pH: '7.2',
        O2: '8.1',
        NTU: '5.2',
        uS: '450'
      },
      {
        date: '2024-01-01 01:00:00',
        temperature: '18.3',
        pH: '7.1',
        O2: '8.3',
        NTU: '5.1',
        uS: '448'
      }
    ]
    
    ElMessage.warning('无法获取实际数据，显示模拟数据')
  } finally {
    previewLoading.value = false
  }
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

// 判断水质状态
const determineWaterQuality = (data) => {
  // 根据溶解氧含量判断水质状态
  if (data.O2 !== undefined) {
    const o2 = parseFloat(data.O2);
    if (o2 >= 5) return '正常';
    if (o2 >= 2) return '警告';
    return '危险';
  }
  return '未知';
}

// 开始水质预测
const startDetection = async () => {
  try {
    detecting.value = true

    // 获取选中的数据表名
    const tableName = selectedExistingData.value[0]?.name 
    
    if (!tableName) {
      ElMessage.error('请选择数据表')
      detecting.value = false
      return
    }

    // 调用后端预测接口
    const response = await axios.post(`${API_BASE_URL}/water-quality/predict`, {
      table_name: tableName,
      prediction_hours: detectionOptions.predictionHours,
      model_type: detectionConfig.model,
      data_name: selectedExistingData.value[0]?.name || 'QianTangRiver2020-2024WorkedFull'
    })

    if (response.data.success) {
      // 处理预测结果，添加水质状态判断
      const predictionsWithQuality = response.data.predictions.map(pred => ({
        ...pred,
        quality: determineWaterQuality(pred)
      }))
      
      detectionResults.value = {
        totalSamples: predictionsWithQuality.length,
        predictions: predictionsWithQuality,
        processingTime: Date.now(),
        previewData: predictionsWithQuality.slice(0, 5) // 只显示前5行预览
      }
      
      ElMessage.success('预测完成！')
    } else {
      throw new Error(response.data.error)
    }
  } catch (error) {
    if (error.response?.data?.error === '模型服务不可用') {
      ElMessage.error('预测模型服务当前不可用，请稍后重试')
    } else {
      ElMessage.error('预测过程中出现错误: ' + (error.response?.data?.message || error.message))
    }
    console.error(error)
  } finally {
    detecting.value = false
  }
}

// 下载结果
const downloadResults = () => {
  if (!detectionResults.value) return

  // 动态获取列名
  const allData = detectionResults.value.predictions
  if (allData.length === 0) return
  
  const headers = Object.keys(allData[0])
  const csvContent = [
    headers.map(h => `"${getColumnLabel(h)}"`).join(','),
    ...allData.map(row => 
      headers.map(header => {
        const value = row[header]
        // 对日期进行特殊处理
        if (header === 'date') {
          return `"${value}"`
        }
        return value
      }).join(',')
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

// 组件挂载时获取数据集列表
onMounted(() => {
  fetchDatasets()
  // 设置默认模型
  detectionConfig.model = 'R-Informer'
  // 设置默认权重
  setTimeout(() => {
    if (availableWeights.value.length > 0) {
      detectionConfig.weights = availableWeights.value[0].value
    }
  }, 100)
})
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