<!-- src/views/admin/PredictionAdvice.vue -->
<template>
  <div class="prediction-advice-container">
    <el-card class="prediction-advice-card">
      <template #header>
        <div class="card-header">
          <span>钱塘江水质数据 → 水质改善建议</span>
        </div>
      </template>

      <!-- 1. 选择数据集 -->
      <el-form :inline="true" class="dataset-form">
        <el-form-item label="选择水质数据集">
          <el-select
            v-model="selectedKey"
            placeholder="请选择"
            @change="loadData"
            style="width: 260px"
            :loading="dataListLoading"
          >
            <el-option 
              v-for="item in dataSets" 
              :key="item.table_name" 
              :label="item.table_name" 
              :value="item.table_name" 
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 2. 生成建议按钮 -->
      <div v-if="selectedKey" class="generate-button">
        <el-button
          type="success"
          :disabled="!selectedKey"
          @click="loadDataAndGenerate"
          class="generate-btn"
        >
          生成水质改善建议
        </el-button>
      </div>

      <!-- 3. 带建议的最终列表 -->
      <el-table
        v-if="tableData.length"
        :data="tableData"
        style="width: 100%; margin-top: 16px"
        max-height="400"
        class="suggestion-table"
      >
        <!-- 动态生成数据列 -->
        <el-table-column 
          v-for="column in dynamicColumns"
          :key="column.name"
          :prop="column.name"
          :label="column.label"
          :width="column.width"
        />
        <el-table-column prop="suggestion" label="水质改善建议" min-width="220" class-name="suggestion-column" />
      </el-table>

      <!-- 4. 导出 -->
      <div v-if="tableData.length" class="export-button">
        <el-button type="primary" @click="downloadCsv" class="export-btn"> 
          下载带建议的 CSV 
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import axios from 'axios'

interface WaterQualityRow {
  date: string
  temperature: string
  pH: string
  O2: string
  NTU: string
  uS: string
  suggestion?: string
  [key: string]: any // 允许动态属性
}

interface DataSet {
  id: number
  table_name: string
  description: string
  row_count: number
}

const API_BASE_URL = '/api'

const selectedKey = ref('')
const tableData = ref<WaterQualityRow[]>([])
const dataSets = ref<DataSet[]>([])
const dataListLoading = ref(false)
const columnInfo = ref<{name: string, label: string, width?: string}[]>([])

// 动态列定义 - 基于实际数据列
const dynamicColumns = computed(() => {
  return columnInfo.value.map(col => ({
    name: col.name,
    label: getColumnLabel(col.name),
    width: col.width || getDefaultColumnWidth(col.name)
  }))
})

// 获取列标签映射
const getColumnLabel = (key: string) => {
  const columnMap: {[key: string]: string} = {
    'date': '日期时间',
    'temperature': '水温(℃)',
    'pH': 'pH值',
    'O2': '溶解氧(mg/L)',
    'NTU': '浊度(NTU)',
    'uS': '电导率(μS/cm)'
  }
  return columnMap[key] || key
}

// 获取默认列宽度
const getDefaultColumnWidth = (key: string) => {
  const widthMap: {[key: string]: string} = {
    'date': '160',
    'temperature': '100',
    'pH': '80',
    'O2': '120',
    'NTU': '100',
    'uS': '120'
  }
  return widthMap[key] || '100'
}

// 获取数据集列表
const fetchDatasets = async () => {
  try {
    dataListLoading.value = true
    const response = await axios.get(`${API_BASE_URL}/water-quality/datasets`)
    
    if (response.data.success) {
      dataSets.value = response.data.datasets || []
    } else {
      throw new Error(response.data.error || '获取数据集失败')
    }
  } catch (error) {
    console.error('获取数据集失败:', error)
    // 使用模拟数据作为备选方案
    dataSets.value = [
      { id: 1, table_name: 'qtj_2023_q1', description: '钱塘江数据集 2023 Q1', row_count: 2000 },
      { id: 2, table_name: 'qtj_2023_q2', description: '钱塘江数据集 2023 Q2', row_count: 2000 },
      { id: 3, table_name: 'qtj_2023_q3', description: '钱塘江数据集 2023 Q3', row_count: 2000 },
      { id: 4, table_name: 'qtj_2023_q4', description: '钱塘江数据集 2023 Q4', row_count: 2000 }
    ]
  } finally {
    dataListLoading.value = false
  }
}

// 加载数据并生成建议
async function loadDataAndGenerate() {
  if (!selectedKey.value) return
  
  try {
    dataListLoading.value = true
    const response = await axios.get(`${API_BASE_URL}/water-quality/datasets/${selectedKey.value}/preview`, {
      params: { limit: 50 } // 增加数据量以生成更全面的建议
    })
    
    if (response.data.success && Array.isArray(response.data.rows)) {
      // 获取列信息
      const rows = response.data.rows
      if (rows.length > 0) {
        const columns = Object.keys(rows[0])
          .filter(key => key !== 'suggestion') // 排除建议列
          .map(key => ({
            name: key,
            label: getColumnLabel(key),
            width: getDefaultColumnWidth(key)
          }))
        columnInfo.value = columns
      }
      
      // 处理数据并生成建议
      tableData.value = rows.map((row: any) => ({
        ...row,
        suggestion: genSuggestion(row)
      }))
    } else {
      throw new Error('数据格式不正确')
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    // 使用模拟数据
    columnInfo.value = [
      { name: 'date', label: '日期时间', width: '160' },
      { name: 'temperature', label: '水温(℃)', width: '100' },
      { name: 'pH', label: 'pH值', width: '80' },
      { name: 'O2', label: '溶解氧(mg/L)', width: '120' },
      { name: 'NTU', label: '浊度(NTU)', width: '100' },
      { name: 'uS', label: '电导率(μS/cm)', width: '120' }
    ]
    
    tableData.value = [
      {
        date: '2023-01-01 08:00',
        temperature: '12.5',
        pH: '6.8',
        O2: '4.2',
        NTU: '12.3',
        uS: '280',
        suggestion: '水质各项指标正常'
      },
      {
        date: '2023-01-01 12:00',
        temperature: '13.2',
        pH: '6.7',
        O2: '4.0',
        NTU: '15.1',
        uS: '295',
        suggestion: '浊度较高，可能存在悬浮物污染，建议检查上游排放'
      }
    ]
  } finally {
    dataListLoading.value = false
  }
}

function genSuggestion(row: WaterQualityRow): string {
  const temp = parseFloat(row.temperature)
  const ph = parseFloat(row.pH)
  const oxygen = parseFloat(row.O2)
  const ntu = parseFloat(row.NTU)
  const conductivity = parseFloat(row.uS)
  
  const suggestions: string[] = []
  
  // 温度建议
  if (temp < 10) {
    suggestions.push('水温偏低，可能影响水生生物活动')
  } else if (temp > 25) {
    suggestions.push('水温偏高，需关注水体富营养化风险')
  }
  
  // pH建议
  if (ph < 6.5) {
    suggestions.push('pH值偏低，水体偏酸性，建议投放石灰调节')
  } else if (ph > 8.5) {
    suggestions.push('pH值偏高，水体偏碱性，建议加强水质监测')
  }
  
  // 溶解氧建议
  if (oxygen < 5) {
    suggestions.push('溶解氧不足，建议增加曝气设备或减少污染源')
  } else if (oxygen > 15) {
    suggestions.push('溶解氧充足，水质良好')
  }
  
  // 浊度建议
  if (ntu > 10) {
    suggestions.push('浊度较高，可能存在悬浮物污染，建议检查上游排放')
  }
  
  // 电导率建议
  if (conductivity > 300) {
    suggestions.push('电导率偏高，可能存在工业废水排放，建议加强监测')
  }
  
  return suggestions.length > 0 ? suggestions.join('; ') : '水质各项指标正常'
}

function downloadCsv() {
  // 获取所有列名
  const headers = [...dynamicColumns.value.map(col => col.name), 'suggestion']
  
  const csv =
    headers.join(',') + '\n' +
    tableData.value
      .map(
        (r) => 
          headers.map(header => 
            `"${String(r[header] || '').replace(/"/g, '""')}"`
          ).join(',')
      )
      .join('\n')
      
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `water_quality_suggestion_${dayjs().format('YYYYMMDDHHmm')}.csv`
  link.click()
}

// 组件挂载时获取数据集列表
onMounted(() => {
  fetchDatasets()
})
</script>

<style scoped>
/* 样式保持不变 */
.prediction-advice-container {
  padding: 20px;
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f7fa 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  min-width: 1200px;
}

.prediction-advice-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976d2' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  animation: bubbleFloat 15s infinite linear;
  z-index: 0;
}

@keyframes bubbleFloat {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 60px;
  }
}

.prediction-advice-card {
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 30px rgba(25, 118, 210, 0.15);
  border: 1px solid rgba(25, 118, 210, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
}

.prediction-advice-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #4caf50, #1976d2);
  animation: progressFlow 3s linear infinite;
}

@keyframes progressFlow {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 200%;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header span {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(90deg, #1976d2, #4caf50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.card-header span::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, #4caf50);
  border-radius: 2px;
}

/* 表单区域 */
.dataset-form {
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(224, 247, 250, 0.5);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.dataset-form::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.dataset-form:hover::before {
  opacity: 1;
}

/* 表格动画 */
.suggestion-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
  margin-bottom: 20px;
  animation: tableAppear 0.6s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes tableAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.el-table__row) {
  transition: all 0.3s;
}

:deep(.el-table__row:hover) {
  background: rgba(224, 247, 250, 0.5) !important;
  transform: scale(1.005);
}

/* 建议列特殊样式 */
.suggestion-column {
  background: linear-gradient(90deg, rgba(224, 247, 250, 0.5), rgba(245, 247, 250, 0.8));
  font-weight: 500;
  color: #1976d2;
}

/* 按钮区域 */
.generate-button, .export-button {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  animation: buttonAppear 0.8s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes buttonAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.generate-btn, .export-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.generate-btn::before, .export-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.generate-btn:hover::before, .export-btn:hover::before {
  width: 300px;
  height: 300px;
}

.generate-btn:hover, .export-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3);
}

.generate-btn {
  background: linear-gradient(135deg, #4caf50, #81c784);
  border: none;
}

.export-btn {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border: none;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .prediction-advice-container {
    min-width: 100%;
    overflow-x: auto;
  }
}
</style>