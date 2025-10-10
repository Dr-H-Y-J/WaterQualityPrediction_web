<!-- src/views/admin/ModelPredict.vue -->
<template>
  <div class="model-predict-container">
    <el-card class="predict-card">
      <template #header>
        <div class="card-header">
          <span>水质预测模型管理</span>
        </div>
      </template>

      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="数据准备"></el-step>
        <el-step title="模型选择"></el-step>
        <el-step title="参数配置"></el-step>
        <el-step title="执行预测"></el-step>
        <el-step title="结果分析"></el-step>
      </el-steps>

      <div class="step-content">
        <!-- 步骤1: 数据准备 -->
        <div v-if="activeStep === 1" class="step-item">
          <h3>选择训练数据集</h3>
          <el-radio-group v-model="predictConfig.dataset" class="dataset-selection">
            <el-radio 
              v-for="dataset in availableDatasets" 
              :key="dataset.value" 
              :label="dataset.value"
              border
            >
              {{ dataset.label }}
            </el-radio>
          </el-radio-group>
          
          <div v-if="predictConfig.dataset" class="dataset-info">
            <h4>数据集信息</h4>
            <p><strong>特征数量:</strong> {{ datasetInfo.features }}</p>
            <p><strong>样本数量:</strong> {{ datasetInfo.samples }}</p>
            <p><strong>描述:</strong> {{ datasetInfo.description }}</p>
          </div>
        </div>

        <!-- 步骤2: 模型选择 -->
        <div v-if="activeStep === 2" class="step-item">
          <h3>选择预测模型</h3>
          <el-radio-group v-model="predictConfig.model" @change="onModelChange" class="model-selection">
            <el-radio 
              v-for="model in availableModels" 
              :key="model.value" 
              :label="model.value"
              border
            >
              {{ model.label }}
            </el-radio>
          </el-radio-group>
          
          <div v-if="predictConfig.model" class="model-info">
            <h4>模型信息</h4>
            <p><strong>模型类型:</strong> {{ predictConfig.model }}</p>
            <p><strong>适用场景:</strong> {{ getModelInfo(predictConfig.model).description }}</p>
            <p><strong>特点:</strong> {{ getModelInfo(predictConfig.model).features }}</p>
          </div>
        </div>

        <!-- 步骤3: 权重选择 -->
        <div v-if="activeStep === 3" class="step-item">
          <h3>选择模型权重</h3>
          <el-select 
            v-model="predictConfig.weights" 
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
          
          <div v-if="predictConfig.weights" class="weights-info">
            <h4>权重文件信息</h4>
            <div v-for="info in weightsInfo" :key="info.key">
              <strong>{{ info.key }}:</strong> {{ info.value }}
            </div>
          </div>
          
          <div class="prediction-options">
            <h3>预测选项</h3>
            <el-form :model="predictionOptions" label-width="120px">
              <el-form-item label="预测时间范围">
                <el-select v-model="predictionOptions.timeRange" placeholder="请选择预测时间">
                  <el-option label="未来24小时" value="24h"></el-option>
                  <el-option label="未来7天" value="7d"></el-option>
                  <el-option label="未来30天" value="30d"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="输出格式">
                <el-radio-group v-model="predictionOptions.outputFormat">
                  <el-radio label="csv">CSV</el-radio>
                  <el-radio label="json">JSON</el-radio>
                  <el-radio label="xlsx">Excel</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="可视化">
                <el-switch v-model="predictionOptions.visualization" />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 步骤4: 执行预测 -->
        <div v-if="activeStep === 4" class="step-item">
          <h3>执行预测</h3>
          <div class="prediction-execution">
            <el-button 
              type="primary" 
              @click="startPrediction" 
              :loading="predicting"
              size="large"
            >
              {{ predicting ? '预测中...' : '开始预测' }}
            </el-button>
            
            <div v-if="predicting" class="progress-info">
              <el-progress :percentage="predictionProgress" />
              <p>正在使用 {{ predictConfig.model }} 模型进行水质预测...</p>
            </div>
          </div>
        </div>

        <!-- 步骤5: 结果分析 -->
        <div v-if="activeStep === 5" class="step-item">
          <h3>预测结果</h3>
          <div v-if="showResults" class="results-container">
            <div class="results-summary">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="result-item">
                    <div class="result-label">预测样本数</div>
                    <div class="result-value">{{ predictionResults.totalSamples }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="result-item">
                    <div class="result-label">预测耗时</div>
                    <div class="result-value">{{ predictionResults.predictionTime }}ms</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="result-item">
                    <div class="result-label">平均置信度</div>
                    <div class="result-value">{{ predictionResults.avgConfidence.toFixed(2) }}%</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <div class="results-chart">
              <h4>水质参数预测趋势</h4>
              <!-- 这里可以集成图表组件 -->
              <div class="chart-placeholder">
                <p>水质预测趋势图将在此处显示</p>
              </div>
            </div>
            
            <div class="results-actions">
              <el-button @click="downloadResults" type="primary">
                下载结果 ({{ predictionOptions.outputFormat.toUpperCase() }})
              </el-button>
              <el-button @click="viewDetails">
                查看详细结果
              </el-button>
              <el-button @click="resetPrediction">
                重新预测
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation-buttons">
        <el-button 
          v-if="activeStep > 1" 
          @click="prevStep" 
          :disabled="predicting"
        >
          上一步
        </el-button>
        <el-button 
          v-if="activeStep < 4" 
          type="primary" 
          @click="nextStep"
          :disabled="predicting"
        >
          下一步
        </el-button>
        <el-button 
          v-if="activeStep === 4 && !predicting" 
          type="primary" 
          @click="startPrediction"
        >
          开始预测
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 步骤控制
const activeStep = ref(1)

// 预测配置
const predictConfig = reactive({
  dataset: '',
  model: '',
  weights: ''
})

// 预测选项
const predictionOptions = reactive({
  timeRange: '24h',
  outputFormat: 'csv',
  visualization: true
})

// 可用数据集
const availableDatasets = [
  { value: 'Dataset_A', label: '长江水质数据集' },
  { value: 'Dataset_B', label: '黄河水质数据集' },
  { value: 'Dataset_C', label: '珠江水质数据集' }
]

// 可用模型
const availableModels = [
  { value: 'LSTM', label: 'LSTM循环神经网络' },
  { value: 'R-Informer', label: 'R-Informer模型' },
  { value: 'Transformer', label: 'Transformer模型' }
]

// 模型信息
const modelInfo = {
  LSTM: {
    description: '适用于时间序列预测，能捕捉水质参数的时间依赖性',
    features: '擅长处理序列数据，对历史数据依赖性强的场景'
  },
  'R-Informer': {
    description: '专为长序列时间序列预测设计，效率高',
    features: '在处理长时间序列时具有较低的内存使用和计算复杂度'
  },
  Transformer: {
    description: '基于注意力机制，能捕捉复杂的参数间关系',
    features: '能够并行处理序列数据，捕捉长期依赖关系'
  }
}

// 权重文件
const mockWeights = {
  LSTM: [
    { value: 'lstm_weights_2023_v1', label: 'LSTM权重文件2023版1', accuracy: '92.5%', trainDate: '2023-06-15' },
    { value: 'lstm_weights_2023_v2', label: 'LSTM权重文件2023版2', accuracy: '93.2%', trainDate: '2023-10-22' }
  ],
  'R-Informer': [
    { value: 'rinf_weights_2023_v1', label: 'R-Informer权重文件2023版1', accuracy: '94.1%', trainDate: '2023-08-30' }
  ],
  Transformer: [
    { value: 'trans_weights_2023_v1', label: 'Transformer权重文件2023版1', accuracy: '91.8%', trainDate: '2023-09-15' }
  ]
}

// 状态控制
const weightsLoading = ref(false)
const predicting = ref(false)
const predictionProgress = ref(0)
const showResults = ref(false)

// 预测结果
const predictionResults = ref({})

// 计算属性
const datasetInfo = computed(() => {
  return getDatasetInfo(predictConfig.dataset)
})

const availableWeights = computed(() => {
  if (!predictConfig.model) return []
  return mockWeights[predictConfig.model] || []
})

const weightsInfo = computed(() => {
  return getWeightsInfo(predictConfig.weights)
})

// 方法
const getDatasetInfo = (dataset) => {
  const datasetInfoMap = {
    Dataset_A: {
      features: 13,
      samples: 10000,
      description: '包含长江流域多个监测点的水质数据，涵盖PH、溶解氧、浊度等参数',
    },
    Dataset_B: {
      features: 8,
      samples: 8500,
      description: '黄河水质监测数据集，重点关注泥沙含量和重金属含量',
    },
    Dataset_C: {
      features: 15,
      samples: 12000,
      description: '珠江流域水质数据，包含有机污染物和营养盐指标',
    },
  }
  return datasetInfoMap[dataset] || {}
}

const getModelInfo = (model) => {
  return modelInfo[model] || {}
}

const getWeightsInfo = (weightsValue) => {
  const allWeights = [...(mockWeights.LSTM || []), ...(mockWeights['R-Informer'] || []), ...(mockWeights.Transformer || [])]
  const weight = allWeights.find((w) => w.value === weightsValue)
  if (!weight) return []

  return [
    { key: '准确率', value: weight.accuracy },
    { key: '训练日期', value: weight.trainDate },
    { key: '文件名', value: weight.label },
  ]
}

const onModelChange = () => {
  predictConfig.weights = ''
  weightsLoading.value = true
  // 模拟加载权重
  setTimeout(() => {
    weightsLoading.value = false
  }, 500)
}

const nextStep = () => {
  if (activeStep.value === 1) {
    if (!predictConfig.dataset) {
      ElMessage.warning('请选择一个数据集！')
      return
    }
  }

  if (activeStep.value === 2) {
    if (!predictConfig.model) {
      ElMessage.warning('请选择一个模型！')
      return
    }
  }

  if (activeStep.value === 3) {
    if (!predictConfig.weights) {
      ElMessage.warning('请选择权重文件！')
      return
    }
  }

  if (activeStep.value < 5) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--
  }
}

const startPrediction = async () => {
  try {
    predicting.value = true
    showResults.value = false
    
    // 模拟预测进度
    const interval = setInterval(() => {
      if (predictionProgress.value < 95) {
        predictionProgress.value += 5
      }
    }, 200)

    const config = {
      ...predictConfig,
      ...predictionOptions,
    }

    console.log('开始预测，配置如下:')
    console.log(config)

    // 模拟预测过程
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    clearInterval(interval)
    predictionProgress.value = 100

    // 模拟预测结果
    predictionResults.value = {
      totalSamples: Math.floor(Math.random() * 1000) + 500,
      predictionTime: Math.floor(Math.random() * 2000) + 1000,
      avgConfidence: Math.random() * 20 + 80,
      results: [], // 这里会包含实际的预测数据
    }

    ElMessage.success('预测完成！')
    showResults.value = true
    activeStep.value = 5
  } catch (error) {
    ElMessage.error('预测过程中出现错误')
    console.error(error)
  } finally {
    predicting.value = false
    predictionProgress.value = 0
  }
}

const downloadResults = () => {
  ElMessage.success(`正在下载${predictionOptions.outputFormat.toUpperCase()}格式的结果文件...`)
  // 实现实际的下载逻辑
}

const viewDetails = () => {
  ElMessage.info('跳转到详细结果页面...')
  // 实现跳转到详细结果页面的逻辑
}

const resetPrediction = () => {
  activeStep.value = 1
  predictConfig.dataset = ''
  predictConfig.model = ''
  predictConfig.weights = ''
  showResults.value = false
  predictionProgress.value = 0
}
</script>

<style scoped>
.model-predict-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 40px);
}

.predict-card {
  width: 100%;
  max-width: 900px;
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
  min-height: 300px;
}

.step-item h3 {
  margin-top: 0;
  color: #1976d2;
}

.dataset-selection, .model-selection {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.dataset-info,
.model-info,
.weights-info {
  background-color: #f9f9f9;
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
}

.dataset-info h4,
.model-info h4,
.weights-info h4 {
  margin-top: 0;
  color: #1976d2;
}

.dataset-info p,
.model-info p,
.weights-info div {
  margin: 8px 0;
  line-height: 1.6;
}

.prediction-options {
  margin-top: 30px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 6px;
}

.prediction-options h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #606266;
  font-size: 16px;
}

.prediction-execution {
  text-align: center;
  padding: 30px 0;
}

.progress-info {
  margin-top: 20px;
}

.results-container {
  padding: 20px 0;
}

.results-summary {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.result-item {
  text-align: center;
  padding: 15px;
}

.result-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.result-value {
  font-size: 20px;
  font-weight: bold;
  color: #1976d2;
}

.results-chart {
  margin: 30px 0;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  border-radius: 6px;
  border: 1px dashed #ccc;
}

.results-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>