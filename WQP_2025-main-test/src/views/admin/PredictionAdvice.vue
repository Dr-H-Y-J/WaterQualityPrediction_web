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
          >
            <el-option 
              v-for="(item, key) in dataSets" 
              :key="key" 
              :label="item.label" 
              :value="key" 
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 2. 数据集预览 -->
      <el-table 
        v-if="rawRows.length" 
        :data="rawRows" 
        style="width: 100%" 
        max-height="300"
        class="data-preview-table"
      >
        <el-table-column prop="date" label="日期时间" width="160" />
        <el-table-column prop="temperature" label="水温(℃)" width="100" />
        <el-table-column prop="pH" label="pH值" width="80" />
        <el-table-column prop="O2" label="溶解氧(mg/L)" width="120" />
        <el-table-column prop="NTU" label="浊度(NTU)" width="100" />
        <el-table-column prop="uS" label="电导率(μS/cm)" width="120" />
      </el-table>

      <!-- 3. 生成建议按钮（放在数据集下方） -->
      <div v-if="rawRows.length" class="generate-button">
        <el-button
          type="success"
          :disabled="!rawRows.length || tableData.length > 0"
          @click="generateSuggestion"
          class="generate-btn"
        >
          生成水质改善建议
        </el-button>
      </div>

      <!-- 4. 带建议的最终列表 -->
      <el-table
        v-if="tableData.length"
        :data="tableData"
        style="width: 100%; margin-top: 16px"
        max-height="400"
        class="suggestion-table"
      >
        <el-table-column prop="date" label="日期时间" width="160" />
        <el-table-column prop="temperature" label="水温(℃)" width="100" />
        <el-table-column prop="pH" label="pH值" width="80" />
        <el-table-column prop="O2" label="溶解氧(mg/L)" width="120" />
        <el-table-column prop="NTU" label="浊度(NTU)" width="100" />
        <el-table-column prop="uS" label="电导率(μS/cm)" width="120" />
        <el-table-column prop="suggestion" label="水质改善建议" min-width="220" class-name="suggestion-column" />
      </el-table>

      <!-- 5. 导出 -->
      <div v-if="tableData.length" class="export-button">
        <el-button type="primary" @click="downloadCsv" class="export-btn"> 
          下载带建议的 CSV 
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

interface WaterQualityRow {
  date: string
  temperature: string
  pH: string
  O2: string
  NTU: string
  uS: string
  suggestion?: string
}

const selectedKey = ref('')
const rawRows = ref<WaterQualityRow[]>([])
const tableData = ref<WaterQualityRow[]>([])

const dataSets = {
  'qtj_2023_q1': { label: '钱塘江数据集 2023 Q1' },
  'qtj_2023_q2': { label: '钱塘江数据集 2023 Q2' },
  'qtj_2023_q3': { label: '钱塘江数据集 2023 Q3' },
  'qtj_2023_q4': { label: '钱塘江数据集 2023 Q4' }
}

function loadData() {
  // 模拟加载数据
  rawRows.value = [
    {
      date: '2023-01-01 08:00',
      temperature: '12.5',
      pH: '6.8',
      O2: '4.2',
      NTU: '12.3',
      uS: '280'
    },
    {
      date: '2023-01-01 12:00',
      temperature: '13.2',
      pH: '6.7',
      O2: '4.0',
      NTU: '15.1',
      uS: '295'
    },
    {
      date: '2023-01-01 16:00',
      temperature: '13.8',
      pH: '6.9',
      O2: '3.8',
      NTU: '18.2',
      uS: '310'
    },
    {
      date: '2023-01-01 20:00',
      temperature: '12.9',
      pH: '7.0',
      O2: '4.5',
      NTU: '10.5',
      uS: '275'
    },
    {
      date: '2023-01-02 08:00',
      temperature: '13.1',
      pH: '6.6',
      O2: '3.9',
      NTU: '16.8',
      uS: '305'
    }
  ]
  tableData.value = []
}

function generateSuggestion() {
  tableData.value = rawRows.value.map((r) => ({
    ...r,
    suggestion: genSuggestion(r),
  }))
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
  const csv =
    'date,temperature,pH,O2,NTU,uS,suggestion\n' +
    tableData.value
      .map(
        (r) => 
          `"${r.date}",${r.temperature},${r.pH},${r.O2},${r.NTU},${r.uS},"${r.suggestion || ''}"`
      )
      .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `water_quality_suggestion_${dayjs().format('YYYYMMDDHHmm')}.csv`
  link.click()
}
</script>

<style scoped>
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
.data-preview-table, .suggestion-table {
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