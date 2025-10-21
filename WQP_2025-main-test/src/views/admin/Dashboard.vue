<template>
  <div class="system-analysis">
    <!-- 头部标题 -->
    <div class="header">
      <h1>钱塘江水质监测平台</h1>
      <div class="time">{{ currentTime }}</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 监测站点数据表格和图表 -->
      <div class="data-section">
        <div class="data-table-section">
          <h3>实时监测数据</h3>
          <div class="table-container">
            <el-table :data="waterSensors" style="width: 100%" max-height="400">
              <el-table-column prop="id" label="监测站点" width="120"></el-table-column>
              <el-table-column prop="ph" label="PH值" width="100"></el-table-column>
              <el-table-column prop="do" label="溶解氧(mg/L)" width="120"></el-table-column>
              <el-table-column prop="turbidity" label="浊度(NTU)" width="120"></el-table-column>
              <el-table-column prop="cod" label="COD(mg/L)" width="120"></el-table-column>
              <el-table-column prop="temperature" label="水温(℃)" width="100"></el-table-column>
              <el-table-column label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 站点水质对比图表 -->
        <div class="chart-container station-chart">
          <h3>各站点水质参数对比</h3>
          <div class="station-chart-controls">
            <el-select 
              v-model="selectedStations" 
              multiple
              placeholder="选择站点进行对比" 
              style="width: 100%;"
            >
              <el-option
                v-for="station in waterSensors"
                :key="station.id"
                :label="station.id"
                :value="station.id"
              />
            </el-select>
          </div>
          <div ref="stationChart" class="chart"></div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="chart-section">
        <!-- 水质参数趋势图 -->
        <div class="chart-container trend-chart-container">
          <h3>水质参数趋势分析</h3>
          <div class="trend-chart-wrapper">
            <div ref="trendChart" class="chart"></div>
            <div class="trend-chart-controls">
              <el-button 
                :type="trendParams.ph ? 'primary' : 'default'" 
                @click="toggleTrendParam('ph')"
                size="small"
              >
                PH值
              </el-button>
              <el-button 
                :type="trendParams.cod ? 'primary' : 'default'" 
                @click="toggleTrendParam('cod')"
                size="small"
              >
                COD
              </el-button>
              <el-button 
                :type="trendParams.turbidity ? 'primary' : 'default'" 
                @click="toggleTrendParam('turbidity')"
                size="small"
              >
                浊度
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 桑基图 -->
        <div class="chart-container">
          <h3>水质数据流向分析</h3>
          <div ref="sankeyChart" class="chart"></div>
        </div>
      </div>

      <!-- 底部信息面板 -->
      <div class="bottom-panels">
        <!-- 水质参数监控 -->
        <div class="water-monitor">
          <h3>当前水质参数</h3>
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
          <h3>水质等级统计</h3>
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
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { ElTable, ElTableColumn, ElTag, ElSelect, ElOption, ElButton } from 'element-plus'

// 响应式数据
const currentTime = ref('')
const trendChart = ref(null)
const sankeyChart = ref(null)
const stationChart = ref(null)
let trendChartInstance = null
let sankeyChartInstance = null
let stationChartInstance = null

// 雷达图相关数据
const selectedStations = ref([]) // 多选站点
const radarViewMode = ref('multiple') // 固定为多站点模式

// 水质参数趋势图控制
const trendParams = ref({
  ph: true,
  cod: true,
  turbidity: true
})

// 水质参数
const waterParams = ref({
  time: '2020/1/5 4:00',
  temperature: 12.8,
  ph: 7.71,
  cod: 11.52,
  turbidity: 6.2,
  conductivity: 252.5
})

// 数据来自数据库
const historyData = ref([])
const predictionData = ref([])

// 生成传感器列表 - 钱塘江监测站点
const generateSensorList = () => {
  const stations = [
    '杭州闸口', '富阳东洲', '桐庐县城', '建德梅城', '淳安千岛湖',
    '衢州城区', '兰溪马公滩', '金华兰江', '绍兴柯桥', '宁波三江口',
    '嘉兴王江泾', '湖州长兴', '台州三门', '温州瓯江口', '舟山沈家门'
  ]
  
  const sensors = []
  
  for (let i = 0; i < stations.length; i++) {
    sensors.push(createSensor(stations[i]))
  }
  
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
    cod: (5 + Math.random() * 20).toFixed(1),
    temperature: (10 + Math.random() * 15).toFixed(1),
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

// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    excellent: 'success',
    good: 'primary',
    warning: 'warning',
    danger: 'danger'
  }
  return typeMap[status] || 'info'
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

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN')
}

// 切换趋势图参数显示
const toggleTrendParam = (param) => {
  trendParams.value[param] = !trendParams.value[param]
  initTrendChart()
}

// 更新雷达图
const updateRadarChart = () => {
  initMultiStationRadarChart()
}

// 初始化多站点雷达图
const initMultiStationRadarChart = () => {
  if (!stationChart.value) return
  
  if (stationChartInstance) {
    stationChartInstance.dispose()
  }
  
  stationChartInstance = echarts.init(stationChart.value)
  
  // 获取选中的站点数据
  const stations = waterSensors.value.filter(s => selectedStations.value.includes(s.id))
  
  // 如果没有选中站点，显示前5个
  if (stations.length === 0) {
    stations.push(...waterSensors.value.slice(0, 5))
  }
  
  // 标准化数据
  const indicator = [
    { name: 'PH值', max: 100 },
    { name: '溶解氧', max: 100 },
    { name: '浊度', max: 100 },
    { name: 'COD', max: 100 },
    { name: '水温', max: 100 }
  ]
  
  const seriesData = stations.map(station => {
    const normalizedData = [
      (station.ph / 14) * 100,
      (station.do / 20) * 100,
      100 - (station.turbidity / 50) * 100,
      100 - (station.cod / 100) * 100,
      100 - Math.abs(station.temperature - 20) / 20 * 100
    ]
    
    return {
      value: normalizedData,
      name: station.id,
      itemStyle: {
        color: getStatusColor(station.status)
      }
    }
  })
  
  const option = {
    title: {
      text: '多站点水质参数对比雷达图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: stations.map(s => s.id),
      bottom: 10
    },
    radar: {
      indicator: indicator,
      radius: '60%'
    },
    series: [{
      type: 'radar',
      data: seriesData
    }]
  }
  
  stationChartInstance.setOption(option)
}

// 获取状态对应的颜色
const getStatusColor = (status) => {
  const colorMap = {
    excellent: '#5470c6',
    good: '#91cc75',
    warning: '#fac858',
    danger: '#ee6666'
  }
  return colorMap[status] || '#5470c6'
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChart.value) return
  
  if (trendChartInstance) {
    trendChartInstance.dispose()
  }
  
  trendChartInstance = echarts.init(trendChart.value)
  
  // 模拟数据
  const dates = []
  const phData = []
  const codData = []
  const turbidityData = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN'))
    
    phData.push((7.0 + Math.random()).toFixed(1))
    codData.push((10 + Math.random() * 15).toFixed(1))
    turbidityData.push((3 + Math.random() * 5).toFixed(1))
  }
  
  const series = []
  
  if (trendParams.value.ph) {
    series.push({
      name: 'PH值',
      type: 'line',
      data: phData.reverse(),
      smooth: true,
      itemStyle: {
        color: '#91cc75'
      }
    })
  }
  
  if (trendParams.value.cod) {
    series.push({
      name: 'COD',
      type: 'line',
      data: codData.reverse(),
      smooth: true,
      itemStyle: {
        color: '#fac858'
      }
    })
  }
  
  if (trendParams.value.turbidity) {
    series.push({
      name: '浊度',
      type: 'line',
      data: turbidityData.reverse(),
      smooth: true,
      itemStyle: {
        color: '#ee6666'
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [
        ...(trendParams.value.ph ? ['PH值'] : []),
        ...(trendParams.value.cod ? ['COD'] : []),
        ...(trendParams.value.turbidity ? ['浊度'] : [])
      ]
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates.reverse()
    },
    yAxis: {
      type: 'value'
    },
    series: series
  }
  
  trendChartInstance.setOption(option)
}

// 初始化桑基图
const initSankeyChart = () => {
  if (!sankeyChart.value) return
  
  if (sankeyChartInstance) {
    sankeyChartInstance.dispose()
  }
  
  sankeyChartInstance = echarts.init(sankeyChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        focusNodeAdjacency: 'allEdges',
        data: [
          { name: '上游' },
          { name: '中游' },
          { name: '下游' },
          { name: '优' },
          { name: '良' },
          { name: '轻度污染' },
          { name: '重度污染' }
        ],
        links: [
          { source: '上游', target: '优', value: 15 },
          { source: '上游', target: '良', value: 3 },
          { source: '中游', target: '优', value: 8 },
          { source: '中游', target: '良', value: 7 },
          { source: '中游', target: '轻度污染', value: 2 },
          { source: '下游', target: '良', value: 3 },
          { source: '下游', target: '轻度污染', value: 5 },
          { source: '下游', target: '重度污染', value: 4 }
        ],
        lineStyle: {
          color: 'source',
          curveness: 0.5
        },
        label: {
          color: 'rgba(0,0,0,0.7)',
          fontSize: 12
        },
        itemStyle: {
          border: '#aaa',
          borderWidth: 1
        }
      }
    ]
  }
  
  sankeyChartInstance.setOption(option)
}

// 定时器
let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  
  // 初始化图表
  nextTick(() => {
    // 设置默认选中站点
    if (waterSensors.value.length > 0) {
      selectedStations.value = [waterSensors.value[0].id]
    }
    
    updateRadarChart()
    initTrendChart()
    initSankeyChart()
  })
  
  // 添加窗口大小改变事件监听
  window.addEventListener('resize', handleResize)
})

// 监听选中站点变化
watch(selectedStations, () => {
  updateRadarChart()
})

// 监听趋势图参数变化
watch(trendParams, () => {
  initTrendChart()
}, { deep: true })

const handleResize = () => {
  // 添加延迟以确保容器尺寸已更新
  setTimeout(() => {
    if (stationChartInstance) stationChartInstance.resize()
    if (trendChartInstance) trendChartInstance.resize()
    if (sankeyChartInstance) sankeyChartInstance.resize()
  }, 100)
}

// 在 onUnmounted 中清理残留代码
onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (stationChartInstance) stationChartInstance.dispose()
  if (trendChartInstance) trendChartInstance.dispose()
  if (sankeyChartInstance) sankeyChartInstance.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 样式保持不变，但需要引入element-plus样式 */
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

.data-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.data-table-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1976d2;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.data-table-section h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  position: relative;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.station-chart {
  height: auto;
}

.station-chart .chart {
  height: 400px;
}

.station-chart-controls {
  margin-bottom: 15px;
}

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

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  position: relative;
}

.trend-chart-wrapper {
  display: flex;
  height: 300px;
}

.trend-chart-wrapper .chart {
  flex: 1;
  height: 100%;
  background: rgba(245, 247, 250, 0.5);
  border-radius: 8px;
}

.trend-chart-controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding-left: 15px;
  width: 80px;
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

.water-monitor h3, .water-stats h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  position: relative;
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
  .data-section {
    grid-template-columns: 1fr;
  }
  
  .chart-section {
    grid-template-columns: 1fr;
  }
  
  .bottom-panels {
    grid-template-columns: 1fr;
  }
  
  .water-params {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .station-chart-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .station-chart-controls .el-select {
    margin-bottom: 10px;
  }
  
  .trend-chart-wrapper {
    flex-direction: column;
    height: auto;
  }
  
  .trend-chart-controls {
    flex-direction: row;
    justify-content: center;
    padding-left: 0;
    padding-top: 15px;
    width: 100%;
  }
}

@media (max-width: 768px) {
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