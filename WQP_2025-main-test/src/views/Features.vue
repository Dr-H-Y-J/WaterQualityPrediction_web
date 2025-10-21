<!-- src/views/Features.vue -->
<template>
  <div class="features-container">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1>功能特性</h1>
        <p>深入了解我们的核心功能和优势</p>
      </div>
    </section>

    <!-- 主要功能 -->
    <section class="main-features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon bg-blue">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="feature-content">
              <h3>实时水质监测</h3>
              <p>通过部署在各个监测点的传感器，实时收集水质数据，包括pH值、溶解氧、浊度、电导率等关键指标。</p>
              <ul>
                <li>24小时不间断监测</li>
                <li>毫秒级数据采集</li>
                <li>异常数据自动标记</li>
              </ul>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon bg-green">
              <i class="fas fa-robot"></i>
            </div>
            <div class="feature-content">
              <h3>AI预测模型</h3>
              <p>基于LSTM、ARIMA等先进的时间序列预测模型，结合机器学习算法，准确预测未来水质变化趋势。</p>
              <ul>
                <li>99%+预测准确率</li>
                <li>支持多参数联合预测</li>
                <li>自适应模型优化</li>
              </ul>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon bg-purple">
              <i class="fas fa-bell"></i>
            </div>
            <div class="feature-content">
              <h3>智能预警系统</h3>
              <p>当监测数据超出预设阈值或预测结果异常时，系统自动触发预警机制，通过多种渠道通知相关人员。</p>
              <ul>
                <li>多级预警机制</li>
                <li>多种通知方式</li>
                <li>自定义预警规则</li>
              </ul>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon bg-orange">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="feature-content">
              <h3>数据分析报告</h3>
              <p>提供丰富的数据分析工具和可视化报表，帮助用户深入理解水质变化规律和趋势。</p>
              <ul>
                <li>自定义报表生成</li>
                <li>多种图表类型</li>
                <li>历史数据对比分析</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术架构 -->
    <section class="tech-architecture">
      <div class="container">
        <div class="section-header">
          <h2>技术架构</h2>
          <p>我们采用先进的技术栈确保系统的稳定性和高效性</p>
        </div>
        <div class="architecture-diagram">
          <div class="layer layer-1">
            <div class="layer-title">数据采集层</div>
            <div class="layer-content">
              <div class="component">传感器网络</div>
              <div class="component">数据采集器</div>
              <div class="component">边缘计算设备</div>
            </div>
          </div>
          <div class="layer layer-2">
            <div class="layer-title">数据传输层</div>
            <div class="layer-content">
              <div class="component">4G/5G网络</div>
              <div class="component">LoRaWAN</div>
              <div class="component">NB-IoT</div>
            </div>
          </div>
          <div class="layer layer-3">
            <div class="layer-title">数据处理层</div>
            <div class="layer-content">
              <div class="component">实时数据处理</div>
              <div class="component">数据清洗</div>
              <div class="component">数据存储</div>
            </div>
          </div>
          <div class="layer layer-4">
            <div class="layer-title">AI分析层</div>
            <div class="layer-content">
              <div class="component">时间序列预测</div>
              <div class="component">异常检测</div>
              <div class="component">趋势分析</div>
            </div>
          </div>
          <div class="layer layer-5">
            <div class="layer-title">应用展示层</div>
            <div class="layer-content">
              <div class="component">Web管理平台</div>
              <div class="component">移动端APP</div>
              <div class="component">API接口</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用场景 -->
    <section class="use-cases">
      <div class="container">
        <div class="section-header">
          <h2>应用场景</h2>
          <p>我们的解决方案适用于多种水质监测场景</p>
        </div>
        <div class="cases-grid">
          <div class="case-card">
            <div class="case-icon">
              <i class="fas fa-city"></i>
            </div>
            <h3>城市供水</h3>
            <p>监测城市自来水厂出水水质，确保居民用水安全</p>
          </div>
          <div class="case-card">
            <div class="case-icon">
              <i class="fas fa-industry"></i>
            </div>
            <h3>工业废水</h3>
            <p>监控工业企业排放废水，确保达标排放</p>
          </div>
          <div class="case-card">
            <div class="case-icon">
              <i class="fas fa-fish"></i>
            </div>
            <h3>水产养殖</h3>
            <p>监测养殖水域水质，优化养殖环境</p>
          </div>
          <div class="case-card">
            <div class="case-icon">
              <i class="fas fa-mountain"></i>
            </div>
            <h3>自然水体</h3>
            <p>监测河流、湖泊等自然水体，保护生态环境</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 功能页面逻辑
</script>

<style scoped>
.features-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #0a192f, #0c2d48);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.page-header p {
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* 主要功能 */
.main-features {
  padding: 100px 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.feature-item {
  background: white;
  border-radius: 10px;
  padding: 40px 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-10px);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-size: 32px;
  color: white;
}

.bg-blue {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.bg-green {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.bg-purple {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.bg-orange {
  background: linear-gradient(135deg, #fa8c16, #faad14);
}

.feature-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.feature-content p {
  color: #666;
  margin-bottom: 20px;
}

.feature-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.feature-content ul li {
  padding: 8px 0 8px 30px;
  position: relative;
  color: #666;
}

.feature-content ul li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

/* 技术架构 */
.tech-architecture {
  padding: 100px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.section-header p {
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.layer {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #1890ff;
}

.layer-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1890ff;
}

.layer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.component {
  background: rgba(24, 144, 255, 0.1);
  padding: 15px 25px;
  border-radius: 30px;
  font-weight: 500;
  color: #1890ff;
}

/* 应用场景 */
.use-cases {
  padding: 100px 0;
  background: #f8f9fa;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.case-card {
  background: white;
  border-radius: 10px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.case-card:hover {
  transform: translateY(-10px);
}

.case-icon {
  width: 70px;
  height: 70px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px;
  color: #1890ff;
}

.case-card h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.case-card p {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .page-header h1 {
    font-size: 36px;
  }
  
  .page-header p {
    font-size: 18px;
  }
  
  .section-header h2 {
    font-size: 28px;
  }
  
  .architecture-diagram {
    gap: 20px;
  }
  
  .layer-content {
    gap: 15px;
  }
  
  .component {
    padding: 12px 20px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 80px 0;
  }
  
  .page-header h1 {
    font-size: 32px;
  }
  
  .main-features,
  .tech-architecture,
  .use-cases {
    padding: 60px 0;
  }
  
  .features-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .layer-content {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 15px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .feature-item,
  .case-card {
    padding: 30px 20px;
  }
}
</style>