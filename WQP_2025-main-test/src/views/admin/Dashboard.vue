<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="system-analysis">
    <!-- 头部标题 -->
    <div class="header">
      <h1>水质预测数据大屏</h1>
      <div class="time">{{ currentTime }}</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 水质实时监测 -->
      <div class="water-quality-section">
        <h3>水质实时监测</h3>
        <div class="water-grid">
          <div
            v-for="sensor in waterSensors"
            :key="sensor.id"
            :class="['sensor-item', sensor.status]"
            @click="showSensorDetail(sensor)"
          >
            <div class="sensor-id">{{ sensor.id }}</div>
            <div class="sensor-params">
              <div>PH: {{ sensor.ph }}</div>
              <div>DO: {{ sensor.do }}mg/L</div>
              <div>浊度: {{ sensor.turbidity }}NTU</div>
            </div>
            <div class="sensor-status-indicator">{{ sensor.statusText }}</div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="chart-section">
        <div class="chart-container">
          <h3>水质参数趋势图</h3>
          <div ref="lineChart" class="chart"></div>
        </div>
        <div class="chart-container">
          <h3>当前水质参数对比</h3>
          <div ref="barChart" class="chart"></div>
        </div>
      </div>

      <!-- 底部信息面板 -->
      <div class="bottom-panels">
        <!-- 水质参数监控 -->
        <div class="water-monitor">
          <h3>水质参数实时监控</h3>
          <div class="water-params">
            <div class="param-item">
              <div class="param-label">时间</div>
              <div class="param-value">{{ waterParams.time }}</div>
            </div>
            <div class="param-item">
              <div class="param-label">水温(℃)</div>
              <div class="param-value">{{ waterParams.temperature }}</div>
            </div>
            <div class="param-item">
              <div class="param-label">PH值</div>
              <div class="param-value" :class="getPHClass(waterParams.ph)">
                {{ waterParams.ph }}
              </div>
            </div>
            <div class="param-item">
              <div class="param-label">COD(mg/L)</div>
              <div class="param-value" :class="getCODClass(waterParams.cod)">
                {{ waterParams.cod }}
              </div>
            </div>
            <div class="param-item">
              <div class="param-label">浊度(NTU)</div>
              <div class="param-value" :class="getTurbidityClass(waterParams.turbidity)">
                {{ waterParams.turbidity }}
              </div>
            </div>
            <div class="param-item">
              <div class="param-label">电导率(μS/cm)</div>
              <div class="param-value">{{ waterParams.conductivity }}</div>
            </div>
          </div>
        </div>

        <!-- 水质统计 -->
        <div class="water-stats">
          <h3>水质统计</h3>
          <div class="stats-grid">
            <div class="stats-item excellent">
              <div class="stats-icon">🟢</div>
              <div class="stats-content">
                <div class="stats-label">优</div>
                <div class="stats-value">{{ excellentSensors }}个</div>
              </div>
            </div>
            <div class="stats-item good">
              <div class="stats-icon">🟡</div>
              <div class="stats-content">
                <div class="stats-label">良</div>
                <div class="stats-value">{{ goodSensors }}个</div>
              </div>
            </div>
            <div class="stats-item warning">
              <div class="stats-icon">🟠</div>
              <div class="stats-content">
                <div class="stats-label">轻度污染</div>
                <div class="stats-value">{{ warningSensors }}个</div>
              </div>
            </div>
            <div class="stats-item danger">
              <div class="stats-icon">🔴</div>
              <div class="stats-content">
                <div class="stats-label">重度污染</div>
                <div class="stats-value">{{ dangerSensors }}个</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const currentTime = ref('')
const totalSensors = ref(28) // A0-Z0 + A1, B1
const lineChart = ref(null)
const barChart = ref(null)
let lineChartInstance = null
let barChartInstance = null

// 水质参数
const waterParams = ref({
  time: '2020/1/5 4:00',
  temperature: 12.8,
  ph: 7.71,
  cod: 11.52,
  turbidity: 6.2,
  conductivity: 252.5
})

// 模拟历史数据（从true_result.csv中提取的部分数据）
const historyData = ref([
  { time: '2020/1/5 4:00', temperature: 12.8, ph: 7.71, cod: 11.52, turbidity: 6.2, conductivity: 252.5 },
  { time: '2020/1/5 5:00', temperature: 12.7, ph: 7.71, cod: 12.63, turbidity: 8.7, conductivity: 252.8 },
  { time: '2020/1/5 6:00', temperature: 13.1, ph: 7.7, cod: 12.41, turbidity: 8.7, conductivity: 252.2 },
  { time: '2020/1/5 7:00', temperature: 13.1, ph: 7.71, cod: 12.68, turbidity: 8.7, conductivity: 252.2 },
  { time: '2020/1/5 8:00', temperature: 12.9, ph: 7.7, cod: 11.39, turbidity: 6.1, conductivity: 252.5 },
  { time: '2020/1/5 9:00', temperature: 12.8, ph: 7.71, cod: 12.2, turbidity: 8.1, conductivity: 252.8 },
  { time: '2020/1/5 10:00', temperature: 13.2, ph: 7.71, cod: 12.35, turbidity: 7.9, conductivity: 252.3 },
  { time: '2020/1/5 11:00', temperature: 13.3, ph: 7.7, cod: 12.17, turbidity: 9.1, conductivity: 252.3 },
  { time: '2020/1/5 12:00', temperature: 13, ph: 7.69, cod: 11.05, turbidity: 6, conductivity: 252.4 },
  { time: '2020/1/5 13:00', temperature: 13.1, ph: 7.69, cod: 11.82, turbidity: 6.5, conductivity: 252.5 }
])

// 生成传感器列表 A0-Z0 + A1, B1
const generateSensorList = () => {
  const sensors = []
  
  // A0-Z0 (26个传感器)
  for (let i = 0; i < 26; i++) {
    const sensorId = String.fromCharCode(65 + i) + '0' // A0, B0, C0...Z0
    sensors.push(createSensor(sensorId))
  }
  
  // A1, B1
  sensors.push(createSensor('A1'))
  sensors.push(createSensor('B1'))
  
  return sensors
}

// 创建传感器对象
const createSensor = (id) => {
  // 水质状态：优、良、轻度污染、重度污染
  const statusTypes = [
    'excellent', // 优
    'good',      // 良
    'warning',   // 轻度污染
    'danger'     // 重度污染
  ]
  
  const status = statusTypes[Math.floor(Math.random() * statusTypes.length)]
  
  return {
    id,
    ph: (6.5 + Math.random() * 2).toFixed(1),
    do: (6 + Math.random() * 4).toFixed(1),
    turbidity: (1 + Math.random() * 10).toFixed(1),
    status,
    statusText: getStatusText(status)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    excellent: '优',
    good: '良',
    warning: '轻度污染',
    danger: '重度污染'
  }
  return statusMap[status] || '未知'
}

// 传感器状态数据
const waterSensors = ref(generateSensorList())

// 计算各类型传感器数量
const excellentSensors = computed(() => 
  waterSensors.value.filter(sensor => sensor.status === 'excellent').length
)

const goodSensors = computed(() => 
  waterSensors.value.filter(sensor => sensor.status === 'good').length
)

const warningSensors = computed(() => 
  waterSensors.value.filter(sensor => sensor.status === 'warning').length
)

const dangerSensors = computed(() => 
  waterSensors.value.filter(sensor => sensor.status === 'danger').length
)

// 获取PH状态样式
const getPHClass = (ph) => {
  if (ph > 8.5 || ph < 6) return 'danger'
  if (ph > 8 || ph < 6.5) return 'warning'
  return 'excellent'
}

// 获取溶解氧状态样式
const getDOClass = (doValue) => {
  if (doValue < 2) return 'danger'
  if (doValue < 4) return 'warning'
  return 'excellent'
}

// 获取浊度状态样式
const getTurbidityClass = (turbidity) => {
  if (turbidity > 5) return 'danger'
  if (turbidity > 3) return 'warning'
  return 'excellent'
}

// 获取COD状态样式
const getCODClass = (cod) => {
  if (cod > 30) return 'danger'
  if (cod > 15) return 'warning'
  return 'excellent'
}

// 显示传感器详情
const showSensorDetail = (sensor) => {
  console.log('传感器详情:', sensor)
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN')
}

// 初始化折线图
const initLineChart = () => {
  if (!lineChart.value) return
  
  lineChartInstance = echarts.init(lineChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['水温(℃)', 'PH值', 'COD(mg/L)', '浊度(NTU)', '电导率(μS/cm)']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: historyData.value.map(item => item.time)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '水温(℃)',
        type: 'line',
        data: historyData.value.map(item => item.temperature),
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: 'PH值',
        type: 'line',
        data: historyData.value.map(item => item.ph),
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#91cc75'
        }
      },
      {
        name: 'COD(mg/L)',
        type: 'line',
        data: historyData.value.map(item => item.cod),
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#fac858'
        }
      },
      {
        name: '浊度(NTU)',
        type: 'line',
        data: historyData.value.map(item => item.turbidity),
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#ee6666'
        }
      },
      {
        name: '电导率(μS/cm)',
        type: 'line',
        data: historyData.value.map(item => item.conductivity),
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#73c0de'
        }
      }
    ]
  }
  
  lineChartInstance.setOption(option)
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChart.value) return
  
  barChartInstance = echarts.init(barChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['水温(℃)', 'PH值', 'COD(mg/L)', '浊度(NTU)', '电导率(μS/cm)']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '当前值',
        type: 'bar',
        barWidth: '60%',
        data: [
          waterParams.value.temperature,
          waterParams.value.ph,
          waterParams.value.cod,
          waterParams.value.turbidity,
          waterParams.value.conductivity
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
            return colors[params.dataIndex]
          },
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  barChartInstance.setOption(option)
}

// 定时器
let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  
  // 在DOM更新后初始化图表
  nextTick(() => {
    initLineChart()
    initBarChart()
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (lineChartInstance) lineChartInstance.dispose()
  if (barChartInstance) barChartInstance.dispose()
})

// 监听窗口大小变化，重置图表大小
window.addEventListener('resize', () => {
  if (lineChartInstance) lineChartInstance.resize()
  if (barChartInstance) barChartInstance.resize()
})
</script>

<style scoped>
.system-analysis {
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f7fa 100%);
  min-height: 100vh;
  color: #333;
  padding: 15px;
  font-family: 'Microsoft YaHei', sans-serif;
  min-width: 1200px;
  position: relative;
  overflow: hidden;
}

.system-analysis::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231976d2' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  animation: waterFlow 20s linear infinite;
  z-index: 0;
}

@keyframes waterFlow {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(100px, 100px);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.header h1 {
  font-size: 2.2rem;
  background: linear-gradient(45deg, #1976d2, #4caf50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  position: relative;
  animation: textGlow 3s infinite alternate;
}

@keyframes textGlow {
  0% {
    text-shadow: 0 0 5px rgba(25, 118, 210, 0.3);
  }
  100% {
    text-shadow: 0 0 20px rgba(25, 118, 210, 0.6);
  }
}

.time {
  font-size: 1.2rem;
  color: #1976d2;
  font-weight: 600;
  position: relative;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(25, 118, 210, 0.1);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.water-quality-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1976d2;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.water-quality-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #4caf50, #1976d2);
  animation: flowLine 3s linear infinite;
}

@keyframes flowLine {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 200%;
  }
}

.water-quality-section h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  position: relative;
}

.water-quality-section h3::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, #4caf50);
  border-radius: 2px;
}

.water-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding: 5px;
}

.sensor-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.sensor-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.sensor-item:hover::before {
  opacity: 1;
}

.sensor-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 优 - 绿色 */
.sensor-item.excellent {
  border-color: #4caf50;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

/* 良 - 蓝色 */
.sensor-item.good {
  border-color: #2196f3;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* 轻度污染 - 黄色 */
.sensor-item.warning {
  border-color: #ff9800;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

/* 重度污染 - 红色 */
.sensor-item.danger {
  border-color: #f44336;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.sensor-id {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
}

.sensor-params {
  font-size: 0.85rem;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.sensor-status-indicator {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  display: inline-block;
  align-self: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.sensor-item.excellent .sensor-status-indicator {
  background: #4caf50;
  color: white;
}

.sensor-item.good .sensor-status-indicator {
  background: #2196f3;
  color: white;
}

.sensor-item.warning .sensor-status-indicator {
  background: #ff9800;
  color: white;
}

.sensor-item.danger .sensor-status-indicator {
  background: #f44336;
  color: white;
}

/* 图表区域 */
.chart-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-container {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1976d2;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.chart-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #4caf50, #1976d2);
  animation: flowLine 3s linear infinite;
}

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  position: relative;
}

.chart-container h3::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, #4caf50);
  border-radius: 2px;
}

.chart {
  width: 100%;
  height: 300px;
  background: rgba(245, 247, 250, 0.5);
  border-radius: 8px;
}

.bottom-panels {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.water-monitor, .water-stats {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.water-monitor::before, .water-stats::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #4caf50, #1976d2);
  animation: flowLine 3s linear infinite;
}

.water-monitor h3, .water-stats h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  position: relative;
}

.water-monitor h3::after, .water-stats h3::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, #4caf50);
  border-radius: 2px;
}

.water-params {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.param-item {
  text-align: center;
  padding: 15px;
  border-radius: 10px;
  background: rgba(248, 249, 250, 0.7);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.param-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.param-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.param-value {
  font-size: 1.4rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.param-value.excellent {
  color: #4caf50;
}

.param-value.warning {
  color: #ff9800;
}

.param-value.danger {
  color: #f44336;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.stats-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  background: rgba(248, 249, 250, 0.7);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-item:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.stats-item.excellent {
  border-left: 4px solid #4caf50;
}

.stats-item.good {
  border-left: 4px solid #2196f3;
}

.stats-item.warning {
  border-left: 4px solid #ff9800;
}

.stats-item.danger {
  border-left: 4px solid #f44336;
}

.stats-icon {
  font-size: 1.5rem;
  margin-right: 15px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 0.9rem;
  color: #666;
}

.stats-value {
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 5px;
}

@media (max-width: 1200px) {
  .water-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .water-params {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .bottom-panels {
    grid-template-columns: 1fr;
  }
  
  .chart-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .water-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .water-params {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>